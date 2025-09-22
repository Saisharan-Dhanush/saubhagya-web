import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AlertProvider, useAlerts } from './AlertContext'

describe('AlertContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('provides alert context to children', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    expect(result.current.alerts).toEqual([])
    expect(typeof result.current.addAlert).toBe('function')
    expect(typeof result.current.removeAlert).toBe('function')
    expect(typeof result.current.clearAlerts).toBe('function')
  })

  it('adds alerts correctly', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    act(() => {
      result.current.addAlert('Test alert message', 'warning')
    })

    expect(result.current.alerts).toHaveLength(1)
    expect(result.current.alerts[0].message).toBe('Test alert message')
    expect(result.current.alerts[0].type).toBe('warning')
    expect(result.current.alerts[0].id).toBeDefined()
    expect(result.current.alerts[0].timestamp).toBeDefined()
  })

  it('adds alerts with different types', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    act(() => {
      result.current.addAlert('Info message', 'info')
      result.current.addAlert('Warning message', 'warning')
      result.current.addAlert('Error message', 'error')
      result.current.addAlert('Critical message', 'critical')
    })

    expect(result.current.alerts).toHaveLength(4)
    expect(result.current.alerts[0].type).toBe('info')
    expect(result.current.alerts[1].type).toBe('warning')
    expect(result.current.alerts[2].type).toBe('error')
    expect(result.current.alerts[3].type).toBe('critical')
  })

  it('adds alerts with options', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    act(() => {
      result.current.addAlert('Persistent alert', 'error', {
        persistent: true,
        system: 'purification',
        autoDismiss: 5
      })
    })

    const alert = result.current.alerts[0]
    expect(alert.persistent).toBe(true)
    expect(alert.system).toBe('purification')
    expect(alert.autoDismiss).toBe(5)
  })

  it('removes alerts by ID', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    let alertId: string

    act(() => {
      alertId = result.current.addAlert('Test alert', 'info')
    })

    expect(result.current.alerts).toHaveLength(1)

    act(() => {
      result.current.removeAlert(alertId)
    })

    expect(result.current.alerts).toHaveLength(0)
  })

  it('clears all alerts', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    act(() => {
      result.current.addAlert('Alert 1', 'info')
      result.current.addAlert('Alert 2', 'warning')
      result.current.addAlert('Alert 3', 'error')
    })

    expect(result.current.alerts).toHaveLength(3)

    act(() => {
      result.current.clearAlerts()
    })

    expect(result.current.alerts).toHaveLength(0)
  })

  it('auto-dismisses alerts after specified time', async () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    act(() => {
      result.current.addAlert('Auto-dismiss alert', 'info', {
        autoDismiss: 3 // 3 seconds
      })
    })

    expect(result.current.alerts).toHaveLength(1)

    // Fast forward 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    await waitFor(() => {
      expect(result.current.alerts).toHaveLength(0)
    })
  })

  it('does not auto-dismiss persistent alerts', async () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    act(() => {
      result.current.addAlert('Persistent alert', 'critical', {
        persistent: true,
        autoDismiss: 2
      })
    })

    expect(result.current.alerts).toHaveLength(1)

    // Fast forward past auto-dismiss time
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    // Persistent alert should still be there
    expect(result.current.alerts).toHaveLength(1)
  })

  it('enforces maximum alert limit', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    // Add more than the default max (50 alerts)
    act(() => {
      for (let i = 0; i < 55; i++) {
        result.current.addAlert(`Alert ${i}`, 'info')
      }
    })

    // Should not exceed max limit
    expect(result.current.alerts.length).toBeLessThanOrEqual(50)
  })

  it('generates unique IDs for each alert', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    const ids: string[] = []

    act(() => {
      for (let i = 0; i < 10; i++) {
        const id = result.current.addAlert(`Alert ${i}`, 'info')
        ids.push(id)
      }
    })

    // All IDs should be unique
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('handles system-specific alerts', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    act(() => {
      result.current.addAlert('Process alarm', 'critical', { system: 'process' })
      result.current.addAlert('Quality alarm', 'warning', { system: 'quality' })
      result.current.addAlert('Maintenance alert', 'info', { system: 'maintenance' })
    })

    expect(result.current.alerts[0].system).toBe('process')
    expect(result.current.alerts[1].system).toBe('quality')
    expect(result.current.alerts[2].system).toBe('maintenance')
  })

  it('maintains alert order (newest first)', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    act(() => {
      result.current.addAlert('First alert', 'info')
    })

    // Small delay to ensure different timestamps
    act(() => {
      vi.advanceTimersByTime(100)
    })

    act(() => {
      result.current.addAlert('Second alert', 'warning')
    })

    // Newest alert should be first
    expect(result.current.alerts[0].message).toBe('Second alert')
    expect(result.current.alerts[1].message).toBe('First alert')
  })
})

// Integration tests for alert system with purification components
describe('Alert System Integration', () => {
  it('handles critical process alarms', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    // Simulate critical H2S alarm
    act(() => {
      result.current.addAlert(
        'High H₂S content: 15 ppm (Limit: <10 ppm)',
        'critical',
        {
          system: 'desulfurization',
          persistent: true
        }
      )
    })

    const alert = result.current.alerts[0]
    expect(alert.type).toBe('critical')
    expect(alert.system).toBe('desulfurization')
    expect(alert.persistent).toBe(true)
    expect(alert.message).toContain('H₂S')
  })

  it('handles quality compliance alerts', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    // Simulate BIS compliance failure
    act(() => {
      result.current.addAlert(
        'BIS 16087:2011 compliance failure - Methane content below 90%',
        'error',
        {
          system: 'quality',
          persistent: true
        }
      )
    })

    const alert = result.current.alerts[0]
    expect(alert.type).toBe('error')
    expect(alert.system).toBe('quality')
    expect(alert.message).toContain('BIS 16087:2011')
  })

  it('handles maintenance alerts', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    // Simulate equipment failure prediction
    act(() => {
      result.current.addAlert(
        'Gas Compressor failure predicted in 48 hours - Schedule immediate maintenance',
        'warning',
        {
          system: 'maintenance',
          autoDismiss: 300 // 5 minutes
        }
      )
    })

    const alert = result.current.alerts[0]
    expect(alert.type).toBe('warning')
    expect(alert.system).toBe('maintenance')
    expect(alert.autoDismiss).toBe(300)
  })

  it('prioritizes critical alerts', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    act(() => {
      result.current.addAlert('Info message', 'info')
      result.current.addAlert('Warning message', 'warning')
      result.current.addAlert('Critical message', 'critical')
      result.current.addAlert('Error message', 'error')
    })

    // Critical and error alerts should be prioritized
    const criticalAlerts = result.current.alerts.filter(a => a.type === 'critical')
    const errorAlerts = result.current.alerts.filter(a => a.type === 'error')

    expect(criticalAlerts).toHaveLength(1)
    expect(errorAlerts).toHaveLength(1)
  })

  it('acknowledges alerts correctly', () => {
    const { result } = renderHook(() => useAlerts(), {
      wrapper: AlertProvider,
    })

    let alertId: string

    act(() => {
      alertId = result.current.addAlert('Critical alarm', 'critical', {
        persistent: true
      })
    })

    expect(result.current.alerts).toHaveLength(1)

    // Acknowledge (remove) the alert
    act(() => {
      result.current.removeAlert(alertId)
    })

    expect(result.current.alerts).toHaveLength(0)
  })
})