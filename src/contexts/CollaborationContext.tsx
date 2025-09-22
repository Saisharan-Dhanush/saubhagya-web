import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export interface CollaborationUser {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  lastSeen: Date
  currentModule?: string
}

export interface CollaborationSession {
  id: string
  name: string
  description: string
  participants: CollaborationUser[]
  startTime: Date
  endTime?: Date
  status: 'active' | 'scheduled' | 'completed'
  modules: string[]
  sharedData: Record<string, any>
}

export interface CollaborationMessage {
  id: string
  sessionId: string
  userId: string
  userName: string
  content: string
  timestamp: Date
  type: 'message' | 'system' | 'alert'
}

export interface SharedWorkspace {
  id: string
  name: string
  description: string
  owner: string
  members: string[]
  modules: string[]
  sharedDashboards: string[]
  permissions: Record<string, string[]>
  createdAt: Date
  lastModified: Date
}

interface CollaborationContextType {
  // Active collaboration
  activeUsers: CollaborationUser[]
  activeSessions: CollaborationSession[]
  currentSession?: CollaborationSession

  // Workspaces
  workspaces: SharedWorkspace[]
  currentWorkspace?: SharedWorkspace

  // Real-time features
  messages: CollaborationMessage[]
  notifications: CollaborationMessage[]

  // Actions
  startSession: (name: string, modules: string[]) => Promise<void>
  joinSession: (sessionId: string) => Promise<void>
  leaveSession: () => Promise<void>
  sendMessage: (content: string, type?: 'message' | 'alert') => Promise<void>

  // Workspace management
  createWorkspace: (name: string, description: string, modules: string[]) => Promise<void>
  switchWorkspace: (workspaceId: string) => Promise<void>
  shareWorkspace: (workspaceId: string, userIds: string[]) => Promise<void>

  // Data sharing
  shareModuleData: (moduleId: string, data: any) => Promise<void>
  getSharedData: (moduleId: string) => any

  // Presence tracking
  updatePresence: (moduleId: string) => void
  getUserPresence: (userId: string) => CollaborationUser | undefined
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined)

export function useCollaboration() {
  const context = useContext(CollaborationContext)
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider')
  }
  return context
}

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([])
  const [activeSessions, setActiveSessions] = useState<CollaborationSession[]>([])
  const [currentSession, setCurrentSession] = useState<CollaborationSession>()
  const [workspaces, setWorkspaces] = useState<SharedWorkspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<SharedWorkspace>()
  const [messages, setMessages] = useState<CollaborationMessage[]>([])
  const [notifications, setNotifications] = useState<CollaborationMessage[]>([])

  // Mock active users for demonstration
  useEffect(() => {
    const mockActiveUsers: CollaborationUser[] = [
      {
        id: 'user-1',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh@saubhagya.com',
        role: 'CEO',
        isActive: true,
        lastSeen: new Date(),
        currentModule: 'urja-neta'
      },
      {
        id: 'user-2',
        name: 'Priya Sharma',
        email: 'priya@saubhagya.com',
        role: 'CFO',
        isActive: true,
        lastSeen: new Date(),
        currentModule: 'urjasanyojak'
      },
      {
        id: 'user-3',
        name: 'Amit Patel',
        email: 'amit@saubhagya.com',
        role: 'Operations Manager',
        isActive: false,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      }
    ]
    setActiveUsers(mockActiveUsers)

    // Mock workspaces
    const mockWorkspaces: SharedWorkspace[] = [
      {
        id: 'ws-1',
        name: 'Executive Strategy Board',
        description: 'Senior leadership strategic planning workspace',
        owner: 'user-1',
        members: ['user-1', 'user-2'],
        modules: ['urja-neta', 'urjasanyojak', 'urja-vyapar'],
        sharedDashboards: ['executive-summary', 'carbon-analytics'],
        permissions: {
          'user-1': ['read', 'write', 'share'],
          'user-2': ['read', 'write']
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastModified: new Date()
      },
      {
        id: 'ws-2',
        name: 'Operations Command Center',
        description: 'Real-time operations monitoring and coordination',
        owner: 'user-3',
        members: ['user-1', 'user-2', 'user-3'],
        modules: ['urjasanyojak', 'shuddhi-doot', 'urja-vyapar'],
        sharedDashboards: ['production-overview', 'quality-control'],
        permissions: {
          'user-1': ['read'],
          'user-2': ['read'],
          'user-3': ['read', 'write', 'share']
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ]
    setWorkspaces(mockWorkspaces)
    setCurrentWorkspace(mockWorkspaces[0])
  }, [])

  // Session management
  const startSession = async (name: string, modules: string[]) => {
    if (!user) return

    const newSession: CollaborationSession = {
      id: `session-${Date.now()}`,
      name,
      description: `Collaboration session started by ${user.name}`,
      participants: [{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: true,
        lastSeen: new Date()
      }],
      startTime: new Date(),
      status: 'active',
      modules,
      sharedData: {}
    }

    setActiveSessions(prev => [...prev, newSession])
    setCurrentSession(newSession)

    // Send system message
    await sendMessage(`Session "${name}" started`, 'system')
  }

  const joinSession = async (sessionId: string) => {
    if (!user) return

    const session = activeSessions.find(s => s.id === sessionId)
    if (!session) return

    // Add user to session participants
    const updatedSession = {
      ...session,
      participants: [
        ...session.participants.filter(p => p.id !== user.id),
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: true,
          lastSeen: new Date()
        }
      ]
    }

    setActiveSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s))
    setCurrentSession(updatedSession)

    await sendMessage(`${user.name} joined the session`, 'system')
  }

  const leaveSession = async () => {
    if (!user || !currentSession) return

    await sendMessage(`${user.name} left the session`, 'system')

    // Remove user from session
    const updatedSession = {
      ...currentSession,
      participants: currentSession.participants.filter(p => p.id !== user.id)
    }

    setActiveSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s))
    setCurrentSession(undefined)
  }

  const sendMessage = async (content: string, type: 'message' | 'alert' | 'system' = 'message') => {
    if (!user || !currentSession) return

    const message: CollaborationMessage = {
      id: `msg-${Date.now()}`,
      sessionId: currentSession.id,
      userId: user.id,
      userName: user.name,
      content,
      timestamp: new Date(),
      type
    }

    setMessages(prev => [...prev, message])

    if (type === 'alert') {
      setNotifications(prev => [...prev, message])
    }
  }

  // Workspace management
  const createWorkspace = async (name: string, description: string, modules: string[]) => {
    if (!user) return

    const newWorkspace: SharedWorkspace = {
      id: `ws-${Date.now()}`,
      name,
      description,
      owner: user.id,
      members: [user.id],
      modules,
      sharedDashboards: [],
      permissions: {
        [user.id]: ['read', 'write', 'share']
      },
      createdAt: new Date(),
      lastModified: new Date()
    }

    setWorkspaces(prev => [...prev, newWorkspace])
  }

  const switchWorkspace = async (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId)
    if (workspace) {
      setCurrentWorkspace(workspace)
    }
  }

  const shareWorkspace = async (workspaceId: string, userIds: string[]) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        const newMembers = [...new Set([...ws.members, ...userIds])]
        const newPermissions = { ...ws.permissions }
        userIds.forEach(userId => {
          if (!newPermissions[userId]) {
            newPermissions[userId] = ['read']
          }
        })
        return { ...ws, members: newMembers, permissions: newPermissions }
      }
      return ws
    }))
  }

  // Data sharing
  const shareModuleData = async (moduleId: string, data: any) => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      sharedData: {
        ...currentSession.sharedData,
        [moduleId]: data
      }
    }

    setCurrentSession(updatedSession)
    setActiveSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s))
  }

  const getSharedData = (moduleId: string) => {
    return currentSession?.sharedData[moduleId]
  }

  // Presence tracking
  const updatePresence = (moduleId: string) => {
    if (!user) return

    setActiveUsers(prev => prev.map(u =>
      u.id === user.id
        ? { ...u, currentModule: moduleId, lastSeen: new Date(), isActive: true }
        : u
    ))
  }

  const getUserPresence = (userId: string) => {
    return activeUsers.find(u => u.id === userId)
  }

  const value = {
    activeUsers,
    activeSessions,
    currentSession,
    workspaces,
    currentWorkspace,
    messages: messages.filter(m => m.sessionId === currentSession?.id),
    notifications,
    startSession,
    joinSession,
    leaveSession,
    sendMessage,
    createWorkspace,
    switchWorkspace,
    shareWorkspace,
    shareModuleData,
    getSharedData,
    updatePresence,
    getUserPresence
  }

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  )
}