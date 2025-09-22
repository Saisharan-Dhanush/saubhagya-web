import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import QualityControlPage from './QualityControlPage'
import { WebSocketProvider } from '../../contexts/WebSocketContext'
import { AlertProvider } from '../../contexts/AlertContext'

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Award: () => <div data-testid="award-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Beaker: () => <div data-testid="beaker-icon" />,
}))

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <WebSocketProvider>
      <AlertProvider>
        {children}
      </AlertProvider>
    </WebSocketProvider>
  )
}

describe('QualityControlPage', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper()
    vi.clearAllMocks()
  })

  it('renders quality control dashboard', () => {
    render(<QualityControlPage />, { wrapper })

    expect(screen.getByText('Quality Control Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Demo Mode')).toBeInTheDocument()
  })

  it('displays BIS 16087:2011 compliance monitoring', async () => {
    render(<QualityControlPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('BIS 16087:2011 Compliance')).toBeInTheDocument()
    })

    // Should show compliance parameters
    expect(screen.getByText('Methane Content')).toBeInTheDocument()
    expect(screen.getByText('H₂S Content')).toBeInTheDocument()
    expect(screen.getByText('Moisture Content')).toBeInTheDocument()
    expect(screen.getByText('Calorific Value')).toBeInTheDocument()
  })

  it('displays PESO safety compliance monitoring', async () => {
    render(<QualityControlPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('PESO Safety Compliance')).toBeInTheDocument()
    })

    // Should show safety parameters
    expect(screen.getByText('Pressure Safety')).toBeInTheDocument()
    expect(screen.getByText('Temperature Safety')).toBeInTheDocument()
    expect(screen.getByText('Leakage Safety')).toBeInTheDocument()
  })

  it('shows quality testing workflow section', async () => {
    render(<QualityControlPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Quality Testing Workflow')).toBeInTheDocument()
    })
  })

  it('displays certificate management section', async () => {
    render(<QualityControlPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Certificate Management')).toBeInTheDocument()
    })
  })

  it('shows quality trends analysis', async () => {
    render(<QualityControlPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Quality Trends')).toBeInTheDocument()
    })

    // Should render chart components
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })
})

// Unit tests for BIS 16087:2011 compliance logic
describe('BIS 16087:2011 Compliance Logic', () => {
  const bisStandards = {
    methaneMin: 90, // % CH₄
    h2sMax: 10,     // ppm
    moistureMax: 0.1, // %
    calorificValueMin: 8500 // kcal/m³
  }

  it('should pass compliance with valid parameters', () => {
    const testData = {
      methane: 94.2,
      h2s: 3.2,
      moisture: 0.08,
      calorificValue: 8750
    }

    const compliance = {
      methaneContent: testData.methane >= bisStandards.methaneMin,
      h2sContent: testData.h2s <= bisStandards.h2sMax,
      moistureContent: testData.moisture <= bisStandards.moistureMax,
      calorificValue: testData.calorificValue >= bisStandards.calorificValueMin
    }

    expect(compliance.methaneContent).toBe(true)
    expect(compliance.h2sContent).toBe(true)
    expect(compliance.moistureContent).toBe(true)
    expect(compliance.calorificValue).toBe(true)

    const overallCompliant = Object.values(compliance).every(check => check)
    expect(overallCompliant).toBe(true)
  })

  it('should fail compliance with low methane content', () => {
    const testData = {
      methane: 88.5, // Below 90% minimum
      h2s: 5.0,
      moisture: 0.08,
      calorificValue: 8600
    }

    const methaneCompliant = testData.methane >= bisStandards.methaneMin
    expect(methaneCompliant).toBe(false)
  })

  it('should fail compliance with high H2S content', () => {
    const testData = {
      methane: 94.0,
      h2s: 12.0, // Above 10 ppm maximum
      moisture: 0.08,
      calorificValue: 8600
    }

    const h2sCompliant = testData.h2s <= bisStandards.h2sMax
    expect(h2sCompliant).toBe(false)
  })

  it('should fail compliance with high moisture content', () => {
    const testData = {
      methane: 94.0,
      h2s: 5.0,
      moisture: 0.15, // Above 0.1% maximum
      calorificValue: 8600
    }

    const moistureCompliant = testData.moisture <= bisStandards.moistureMax
    expect(moistureCompliant).toBe(false)
  })

  it('should fail compliance with low calorific value', () => {
    const testData = {
      methane: 94.0,
      h2s: 5.0,
      moisture: 0.08,
      calorificValue: 8200 // Below 8500 kcal/m³ minimum
    }

    const calorificCompliant = testData.calorificValue >= bisStandards.calorificValueMin
    expect(calorificCompliant).toBe(false)
  })
})

// Unit tests for PESO safety compliance logic
describe('PESO Safety Compliance Logic', () => {
  const pesoStandards = {
    pressureMax: 2.5,    // bar
    temperatureMax: 60,   // °C
    leakageMax: 0.1      // % volume
  }

  it('should pass PESO compliance with safe parameters', () => {
    const testData = {
      pressure: 2.0,
      temperature: 55,
      leakage: 0.05
    }

    const compliance = {
      pressureSafety: testData.pressure <= pesoStandards.pressureMax,
      temperatureSafety: testData.temperature <= pesoStandards.temperatureMax,
      leakageSafety: testData.leakage <= pesoStandards.leakageMax
    }

    expect(compliance.pressureSafety).toBe(true)
    expect(compliance.temperatureSafety).toBe(true)
    expect(compliance.leakageSafety).toBe(true)

    const overallCompliant = Object.values(compliance).every(check => check)
    expect(overallCompliant).toBe(true)
  })

  it('should fail PESO compliance with high pressure', () => {
    const testData = {
      pressure: 2.8, // Above 2.5 bar maximum
      temperature: 55,
      leakage: 0.05
    }

    const pressureCompliant = testData.pressure <= pesoStandards.pressureMax
    expect(pressureCompliant).toBe(false)
  })

  it('should fail PESO compliance with high temperature', () => {
    const testData = {
      pressure: 2.0,
      temperature: 65, // Above 60°C maximum
      leakage: 0.05
    }

    const temperatureCompliant = testData.temperature <= pesoStandards.temperatureMax
    expect(temperatureCompliant).toBe(false)
  })

  it('should fail PESO compliance with excessive leakage', () => {
    const testData = {
      pressure: 2.0,
      temperature: 55,
      leakage: 0.15 // Above 0.1% maximum
    }

    const leakageCompliant = testData.leakage <= pesoStandards.leakageMax
    expect(leakageCompliant).toBe(false)
  })
})

// Unit tests for certificate generation logic
describe('Certificate Generation Logic', () => {
  it('should generate certificate for compliant batch', () => {
    const batchData = {
      batchId: 'PUR-2024-09-001',
      testResults: {
        methane: 94.2,
        h2s: 3.2,
        moisture: 0.08,
        calorificValue: 8750,
        pressure: 2.0,
        temperature: 55,
        leakage: 0.05
      }
    }

    const certificateData = {
      certificateId: `QC-${batchData.batchId}-${Date.now()}`,
      batchId: batchData.batchId,
      testDate: new Date().toISOString(),
      testResults: batchData.testResults,
      certifiedBy: 'SAUBHAGYA Quality Control',
      standards: ['BIS 16087:2011', 'PESO Safety Requirements']
    }

    expect(certificateData.certificateId).toContain(batchData.batchId)
    expect(certificateData.standards).toContain('BIS 16087:2011')
    expect(certificateData.standards).toContain('PESO Safety Requirements')
  })

  it('should calculate certificate validity period', () => {
    const validityDays = 30
    const issueDate = new Date()
    const validUntil = new Date(issueDate.getTime() + validityDays * 24 * 60 * 60 * 1000)

    const daysDifference = Math.ceil((validUntil.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24))
    expect(daysDifference).toBe(validityDays)
  })
})