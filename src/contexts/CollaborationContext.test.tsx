import React from 'react'
import { render, renderHook, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  CollaborationProvider,
  useCollaboration,
  CollaborationUser,
  CollaborationSession,
  SharedWorkspace,
  CollaborationMessage
} from './CollaborationContext'
import { AuthProvider } from './AuthContext'

// Mock AuthContext
const mockUser = {
  id: 'test-user',
  email: 'test@example.com',
  name: 'Test User',
  role: 'executive' as const,
  permissions: [],
  executiveLevel: 'ceo' as const
}

const mockAuthContext = {
  user: mockUser,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  hasPermission: vi.fn().mockReturnValue(true),
  isExecutive: vi.fn().mockReturnValue(true),
  getAccessLevel: vi.fn().mockReturnValue('high' as const)
}

// Mock AuthContext module
vi.mock('./AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock WebSocket
const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn(),
  readyState: WebSocket.OPEN,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}

global.WebSocket = vi.fn(() => mockWebSocket) as any

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <CollaborationProvider>
      {children}
    </CollaborationProvider>
  </AuthProvider>
)

describe('CollaborationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Provider Setup', () => {
    it('provides collaboration context without errors', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      expect(result.current).toBeDefined()
      expect(result.current.isConnected).toBe(false) // Initially not connected
      expect(result.current.activeUsers).toEqual([])
      expect(result.current.sessions).toEqual([])
    })

    it('throws error when used outside provider', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useCollaboration())
      }).toThrow('useCollaboration must be used within a CollaborationProvider')

      spy.mockRestore()
    })
  })

  describe('User Presence Management', () => {
    it('initializes with empty active users', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      expect(result.current.activeUsers).toEqual([])
      expect(result.current.isConnected).toBe(false)
    })

    it('handles user presence updates', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      const mockPresenceData = {
        type: 'user_joined',
        user: {
          id: 'user-2',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'avatar-url',
          status: 'online' as const,
          lastActive: new Date(),
          currentModule: 'urjasanyojak'
        }
      }

      act(() => {
        // Simulate WebSocket message
        const messageHandler = mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'message')?.[1]
        if (messageHandler) {
          messageHandler({ data: JSON.stringify(mockPresenceData) })
        }
      })

      expect(result.current.activeUsers).toHaveLength(1)
      expect(result.current.activeUsers[0].name).toBe('John Doe')
    })

    it('updates user status correctly', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.updateUserStatus('busy')
      })

      // Should send WebSocket message with status update
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"status_update"')
      )
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"status":"busy"')
      )
    })

    it('handles user disconnection', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      // First add a user
      act(() => {
        const messageHandler = mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'message')?.[1]
        if (messageHandler) {
          messageHandler({
            data: JSON.stringify({
              type: 'user_joined',
              user: { id: 'user-2', name: 'John', status: 'online' }
            })
          })
        }
      })

      // Then disconnect the user
      act(() => {
        const messageHandler = mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'message')?.[1]
        if (messageHandler) {
          messageHandler({
            data: JSON.stringify({
              type: 'user_left',
              userId: 'user-2'
            })
          })
        }
      })

      expect(result.current.activeUsers).toHaveLength(0)
    })
  })

  describe('Session Management', () => {
    it('creates new collaboration session', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      const sessionData = {
        name: 'Executive Review',
        description: 'Monthly executive review session',
        modules: ['urjasanyojak', 'urja-neta']
      }

      act(() => {
        result.current.createSession(sessionData)
      })

      expect(result.current.sessions).toHaveLength(1)
      expect(result.current.sessions[0].name).toBe('Executive Review')
      expect(result.current.sessions[0].status).toBe('active')
      expect(result.current.sessions[0].participants).toHaveLength(1)
    })

    it('joins existing session', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      // Create a session first
      act(() => {
        result.current.createSession({
          name: 'Test Session',
          description: 'Test',
          modules: ['urjasanyojak']
        })
      })

      const sessionId = result.current.sessions[0].id

      act(() => {
        result.current.joinSession(sessionId)
      })

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"join_session"')
      )
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining(`"sessionId":"${sessionId}"`)
      )
    })

    it('leaves session correctly', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      const sessionId = 'test-session-id'

      act(() => {
        result.current.leaveSession(sessionId)
      })

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"leave_session"')
      )
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining(`"sessionId":"${sessionId}"`)
      )
    })

    it('ends session and updates state', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      // Create a session first
      act(() => {
        result.current.createSession({
          name: 'Test Session',
          description: 'Test',
          modules: ['urjasanyojak']
        })
      })

      const sessionId = result.current.sessions[0].id

      act(() => {
        result.current.endSession(sessionId)
      })

      const session = result.current.sessions.find(s => s.id === sessionId)
      expect(session?.status).toBe('completed')
    })
  })

  describe('Messaging System', () => {
    it('sends message to session', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      const sessionId = 'test-session'
      const message = 'Test message'

      act(() => {
        result.current.sendMessage(sessionId, message)
      })

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"send_message"')
      )
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining(`"sessionId":"${sessionId}"`)
      )
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining(`"content":"${message}"`)
      )
    })

    it('handles incoming messages', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      const mockMessage = {
        type: 'new_message',
        message: {
          id: 'msg-1',
          sessionId: 'session-1',
          senderId: 'user-2',
          senderName: 'John Doe',
          content: 'Hello everyone',
          timestamp: new Date().toISOString(),
          type: 'text' as const
        }
      }

      act(() => {
        const messageHandler = mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'message')?.[1]
        if (messageHandler) {
          messageHandler({ data: JSON.stringify(mockMessage) })
        }
      })

      expect(result.current.messages).toHaveLength(1)
      expect(result.current.messages[0].content).toBe('Hello everyone')
    })

    it('gets messages for specific session', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      // Add a message
      act(() => {
        const messageHandler = mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'message')?.[1]
        if (messageHandler) {
          messageHandler({
            data: JSON.stringify({
              type: 'new_message',
              message: {
                id: 'msg-1',
                sessionId: 'session-1',
                content: 'Test message',
                senderId: 'user-1',
                senderName: 'Test User',
                timestamp: new Date().toISOString(),
                type: 'text'
              }
            })
          })
        }
      })

      const sessionMessages = result.current.getSessionMessages('session-1')
      expect(sessionMessages).toHaveLength(1)
      expect(sessionMessages[0].content).toBe('Test message')

      const emptyMessages = result.current.getSessionMessages('session-2')
      expect(emptyMessages).toHaveLength(0)
    })
  })

  describe('Shared Workspaces', () => {
    it('creates shared workspace', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      const workspaceData = {
        name: 'Strategic Planning',
        description: 'Q1 strategic planning workspace',
        modules: ['urja-neta'],
        permissions: {
          read: ['executive', 'manager'],
          write: ['executive'],
          admin: ['executive']
        }
      }

      act(() => {
        result.current.createWorkspace(workspaceData)
      })

      expect(result.current.workspaces).toHaveLength(1)
      expect(result.current.workspaces[0].name).toBe('Strategic Planning')
      expect(result.current.workspaces[0].createdBy).toBe('test-user')
    })

    it('updates workspace data', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      // Create workspace first
      act(() => {
        result.current.createWorkspace({
          name: 'Test Workspace',
          description: 'Test',
          modules: ['urjasanyojak'],
          permissions: { read: ['executive'], write: ['executive'], admin: ['executive'] }
        })
      })

      const workspaceId = result.current.workspaces[0].id
      const updateData = { key: 'value', updatedField: 'new value' }

      act(() => {
        result.current.updateWorkspaceData(workspaceId, updateData)
      })

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"workspace_update"')
      )
    })

    it('gets accessible workspaces for user', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      // Create workspaces with different permissions
      act(() => {
        result.current.createWorkspace({
          name: 'Executive Workspace',
          description: 'Executive only',
          modules: ['urja-neta'],
          permissions: { read: ['executive'], write: ['executive'], admin: ['executive'] }
        })
      })

      act(() => {
        result.current.createWorkspace({
          name: 'Manager Workspace',
          description: 'Manager only',
          modules: ['urjasanyojak'],
          permissions: { read: ['manager'], write: ['manager'], admin: ['manager'] }
        })
      })

      const accessibleWorkspaces = result.current.getAccessibleWorkspaces()

      // Executive should have access to executive workspace
      expect(accessibleWorkspaces).toHaveLength(1)
      expect(accessibleWorkspaces[0].name).toBe('Executive Workspace')
    })
  })

  describe('WebSocket Connection Management', () => {
    it('establishes WebSocket connection on mount', () => {
      renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8080/collaboration')
    })

    it('handles connection events', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      // Simulate connection open
      act(() => {
        const openHandler = mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'open')?.[1]
        if (openHandler) {
          openHandler({})
        }
      })

      expect(result.current.isConnected).toBe(true)
    })

    it('handles connection close', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      // First open connection
      act(() => {
        const openHandler = mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'open')?.[1]
        if (openHandler) {
          openHandler({})
        }
      })

      // Then close it
      act(() => {
        const closeHandler = mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'close')?.[1]
        if (closeHandler) {
          closeHandler({})
        }
      })

      expect(result.current.isConnected).toBe(false)
    })

    it('handles WebSocket errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      act(() => {
        const errorHandler = mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'error')?.[1]
        if (errorHandler) {
          errorHandler({ error: 'Connection failed' })
        }
      })

      expect(consoleSpy).toHaveBeenCalledWith('WebSocket error:', { error: 'Connection failed' })
      consoleSpy.mockRestore()
    })
  })

  describe('Cleanup and Persistence', () => {
    it('cleans up WebSocket connection on unmount', () => {
      const { unmount } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      unmount()

      expect(mockWebSocket.close).toHaveBeenCalled()
    })

    it('persists workspace data to localStorage', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.createWorkspace({
          name: 'Persistent Workspace',
          description: 'Test persistence',
          modules: ['urjasanyojak'],
          permissions: { read: ['executive'], write: ['executive'], admin: ['executive'] }
        })
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'collaborationWorkspaces',
        expect.stringContaining('Persistent Workspace')
      )
    })

    it('loads persisted workspace data on initialization', () => {
      const persistedWorkspaces = [{
        id: 'workspace-1',
        name: 'Loaded Workspace',
        description: 'From localStorage',
        modules: ['urjasanyojak'],
        permissions: { read: ['executive'], write: ['executive'], admin: ['executive'] },
        createdBy: 'test-user',
        createdAt: new Date().toISOString(),
        sharedData: {}
      }]

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(persistedWorkspaces))

      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      expect(result.current.workspaces).toHaveLength(1)
      expect(result.current.workspaces[0].name).toBe('Loaded Workspace')
    })

    it('handles corrupt localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      expect(result.current.workspaces).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('handles missing user gracefully', () => {
      mockAuthContext.user = null

      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      expect(result.current.activeUsers).toEqual([])
      expect(result.current.sessions).toEqual([])
    })

    it('validates session creation with proper error handling', () => {
      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      act(() => {
        // Try to create session with invalid data
        result.current.createSession({
          name: '',
          description: '',
          modules: []
        })
      })

      // Should not create session with empty data
      expect(result.current.sessions).toHaveLength(0)

      consoleSpy.mockRestore()
    })

    it('handles WebSocket send errors', () => {
      mockWebSocket.send.mockImplementation(() => {
        throw new Error('Send failed')
      })

      const { result } = renderHook(() => useCollaboration(), {
        wrapper: TestWrapper
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      act(() => {
        result.current.sendMessage('session-1', 'test message')
      })

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})