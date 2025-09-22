import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, renderHook, act, waitFor } from '@testing-library/react'
import { WebSocketProvider, useWebSocket } from './WebSocketContext'

// Mock WebSocket
const mockWebSocket = {
  readyState: WebSocket.CONNECTING,
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

global.WebSocket = vi.fn(() => mockWebSocket) as any

describe('WebSocketContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWebSocket.readyState = WebSocket.CONNECTING
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('provides WebSocket context to children', () => {
    const TestComponent = () => {
      const { isConnected } = useWebSocket()
      return <div data-testid="connection-status">{isConnected ? 'Connected' : 'Disconnected'}</div>
    }

    const { getByTestId } = render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    )

    expect(getByTestId('connection-status')).toBeInTheDocument()
  })

  it('initializes with disconnected state', () => {
    const { result } = renderHook(() => useWebSocket(), {
      wrapper: WebSocketProvider,
    })

    expect(result.current.isConnected).toBe(false)
    expect(result.current.wsData).toBeNull()
  })

  it('handles WebSocket connection establishment', async () => {
    const { result } = renderHook(() => useWebSocket('/purification/process'), {
      wrapper: WebSocketProvider,
    })

    // Simulate WebSocket connection opening
    act(() => {
      mockWebSocket.readyState = WebSocket.OPEN
      const openEvent = new Event('open')
      mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'open')?.[1]?.(openEvent)
    })

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true)
    })
  })

  it('handles WebSocket message reception', async () => {
    const testData = {
      methaneContent: 94.2,
      h2sContent: 3.2,
      timestamp: new Date().toISOString()
    }

    const { result } = renderHook(() => useWebSocket('/purification/process'), {
      wrapper: WebSocketProvider,
    })

    // Simulate WebSocket connection and message
    act(() => {
      mockWebSocket.readyState = WebSocket.OPEN
      const messageEvent = {
        data: JSON.stringify(testData)
      } as MessageEvent

      const messageHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'message')?.[1]

      if (messageHandler) {
        messageHandler(messageEvent)
      }
    })

    await waitFor(() => {
      expect(result.current.wsData).toEqual(testData)
    })
  })

  it('handles WebSocket connection errors', async () => {
    const { result } = renderHook(() => useWebSocket('/purification/process'), {
      wrapper: WebSocketProvider,
    })

    // Simulate WebSocket error
    act(() => {
      const errorEvent = new Event('error')
      const errorHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'error')?.[1]

      if (errorHandler) {
        errorHandler(errorEvent)
      }
    })

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false)
    })
  })

  it('handles WebSocket connection close', async () => {
    const { result } = renderHook(() => useWebSocket('/purification/process'), {
      wrapper: WebSocketProvider,
    })

    // First connect
    act(() => {
      mockWebSocket.readyState = WebSocket.OPEN
      const openEvent = new Event('open')
      mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'open')?.[1]?.(openEvent)
    })

    // Then close
    act(() => {
      mockWebSocket.readyState = WebSocket.CLOSED
      const closeEvent = new CloseEvent('close')
      const closeHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'close')?.[1]

      if (closeHandler) {
        closeHandler(closeEvent)
      }
    })

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false)
    })
  })

  it('attempts reconnection after connection loss', async () => {
    vi.useFakeTimers()

    const { result } = renderHook(() => useWebSocket('/purification/process'), {
      wrapper: WebSocketProvider,
    })

    // Simulate connection loss
    act(() => {
      const closeEvent = new CloseEvent('close')
      const closeHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'close')?.[1]

      if (closeHandler) {
        closeHandler(closeEvent)
      }
    })

    // Fast forward to trigger reconnection attempt
    act(() => {
      vi.advanceTimersByTime(5000) // 5 second reconnection delay
    })

    // Verify new WebSocket instance was created
    expect(global.WebSocket).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  it('handles invalid JSON messages gracefully', async () => {
    const { result } = renderHook(() => useWebSocket('/purification/process'), {
      wrapper: WebSocketProvider,
    })

    // Simulate invalid JSON message
    act(() => {
      const messageEvent = {
        data: 'invalid json{'
      } as MessageEvent

      const messageHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'message')?.[1]

      if (messageHandler) {
        messageHandler(messageEvent)
      }
    })

    // Should not crash and maintain previous state
    expect(result.current.wsData).toBeNull()
  })

  it('cleans up WebSocket on unmount', () => {
    const { unmount } = renderHook(() => useWebSocket('/purification/process'), {
      wrapper: WebSocketProvider,
    })

    unmount()

    expect(mockWebSocket.close).toHaveBeenCalled()
  })

  it('subscribes to specific endpoints', () => {
    const endpoint = '/purification/process'

    renderHook(() => useWebSocket(endpoint), {
      wrapper: WebSocketProvider,
    })

    // Verify WebSocket was created with correct URL
    expect(global.WebSocket).toHaveBeenCalledWith(
      expect.stringContaining(endpoint)
    )
  })

  it('handles multiple concurrent subscriptions', () => {
    const TestComponent = () => {
      const processData = useWebSocket('/purification/process')
      const qualityData = useWebSocket('/purification/quality')

      return (
        <div>
          <div data-testid="process-connected">{processData.isConnected ? 'true' : 'false'}</div>
          <div data-testid="quality-connected">{qualityData.isConnected ? 'true' : 'false'}</div>
        </div>
      )
    }

    render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    )

    // Should handle multiple endpoint subscriptions
    expect(global.WebSocket).toHaveBeenCalledTimes(2)
  })
})

// Integration tests for real-time data flow
describe('Real-time Data Flow Integration', () => {
  it('delivers process data to monitoring components', async () => {
    const processData = {
      methaneContent: 94.2,
      h2sContent: 3.2,
      inletPressure: 2.0,
      timestamp: new Date().toISOString()
    }

    const { result } = renderHook(() => useWebSocket('/purification/process'), {
      wrapper: WebSocketProvider,
    })

    // Simulate data reception
    act(() => {
      mockWebSocket.readyState = WebSocket.OPEN
      const messageEvent = {
        data: JSON.stringify(processData)
      } as MessageEvent

      const messageHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'message')?.[1]

      if (messageHandler) {
        messageHandler(messageEvent)
      }
    })

    await waitFor(() => {
      expect(result.current.wsData).toEqual(processData)
      expect(result.current.isConnected).toBe(true)
    })
  })

  it('delivers quality data to quality control components', async () => {
    const qualityData = {
      bisCompliance: {
        methaneContent: true,
        h2sContent: true,
        moistureContent: true,
        calorificValue: true
      },
      pesoCompliance: {
        pressureSafety: true,
        temperatureSafety: true,
        leakageSafety: true
      },
      timestamp: new Date().toISOString()
    }

    const { result } = renderHook(() => useWebSocket('/purification/quality'), {
      wrapper: WebSocketProvider,
    })

    // Simulate quality data reception
    act(() => {
      mockWebSocket.readyState = WebSocket.OPEN
      const messageEvent = {
        data: JSON.stringify(qualityData)
      } as MessageEvent

      const messageHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'message')?.[1]

      if (messageHandler) {
        messageHandler(messageEvent)
      }
    })

    await waitFor(() => {
      expect(result.current.wsData).toEqual(qualityData)
    })
  })

  it('maintains connection state across component re-renders', async () => {
    const { result, rerender } = renderHook(() => useWebSocket('/purification/process'), {
      wrapper: WebSocketProvider,
    })

    // Connect
    act(() => {
      mockWebSocket.readyState = WebSocket.OPEN
      const openEvent = new Event('open')
      mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'open')?.[1]?.(openEvent)
    })

    const firstConnectionState = result.current.isConnected

    // Re-render
    rerender()

    // Connection state should persist
    expect(result.current.isConnected).toBe(firstConnectionState)
  })
})