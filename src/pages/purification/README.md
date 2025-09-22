# ShuddhiDoot - Purification Control Dashboard

## Overview

ShuddhiDoot is a comprehensive React-based dashboard for purification unit operators to monitor and control water scrubbing systems, manage gas quality parameters, track PESO compliance, and optimize purification processes. This implementation fulfills the requirements specified in Story 17-2.

## Features

### 1. Real-Time Process Monitoring
- **Live process gauges** for methane content, H₂S levels, pressure, and flow rate
- **Real-time trends** with 24-hour historical data visualization
- **Gas composition analysis** with interactive pie charts
- **Active alarm system** with critical and warning alerts
- **System performance metrics** including scrubber efficiency and temperature monitoring

### 2. Quality Control & Compliance
- **BIS 16087:2011 compliance monitoring** with automated standard checks
- **PESO safety compliance** tracking and validation
- **Quality testing workflows** with pass/fail result tracking
- **Certificate generation** with blockchain integration support
- **Quality trends analysis** over time with statistical insights

### 3. Process Optimization & Control
- **Interactive parameter controls** for scrubber pressure, water flow, temperature
- **Manual and automatic optimization modes** with AI-driven recommendations
- **Real-time performance metrics** calculation and display
- **Optimization recommendations** with confidence scoring
- **Performance radar charts** for comprehensive analysis

### 4. Maintenance & Troubleshooting
- **Equipment health monitoring** with predictive analytics
- **Maintenance scheduling** with task management and progress tracking
- **Spare parts inventory** management with low-stock alerts
- **Predictive failure detection** with probability scoring and recommendations
- **Equipment detailed analysis** with trend monitoring

### 5. Production & Batch Management
- **Batch tracking and monitoring** with real-time progress updates
- **Production scheduling** with priority management
- **Quality traceability** from raw materials to final product
- **Certificate management** for BIS and PESO compliance
- **Production statistics** and performance metrics

## Architecture

### Component Structure
```
src/pages/purification/
├── ShuddhiDootApp.tsx           # Main application with routing
├── ProcessMonitoringPage.tsx    # Real-time monitoring dashboard
├── QualityControlPage.tsx       # Quality control and compliance
├── ProcessOptimizationPage.tsx  # Process parameter optimization
├── MaintenancePage.tsx          # Equipment maintenance management
├── BatchManagementPage.tsx      # Production batch tracking
└── pages/
    └── index.ts                 # Component exports
```

### Context Providers
- **WebSocketContext**: Real-time data connection management
- **AlertContext**: System notification and alarm management
- **PurificationLayout**: Navigation and layout management

### UI Components
Built with shadcn/ui components including:
- Cards, Badges, Buttons, Alerts
- Progress bars, Tabs, Selectors
- Input controls, Sliders, Text areas
- Charts via Recharts library

## Technologies Used

- **React 18** with TypeScript for type safety
- **React Query** for data fetching and caching
- **React Router** for navigation
- **WebSocket** connections for real-time data
- **Recharts** for data visualization
- **Tailwind CSS** with shadcn/ui for styling
- **Lucide React** for icons

## Configuration

### WebSocket Endpoints
- `/purification/process` - Real-time process data
- `/purification/quality` - Quality control data
- `/purification/optimization` - Optimization parameters
- `/purification/maintenance` - Equipment health data
- `/purification/batch` - Batch management data

### Mock Data Support
When WebSocket connections are unavailable, the dashboard automatically switches to demo mode with realistic mock data for testing and demonstration purposes.

## Standards Compliance

### BIS 16087:2011 Standards
- Methane content: ≥90%
- H₂S content: ≤10 ppm
- Moisture content: ≤0.1%
- Calorific value: ≥8500 kcal/m³

### PESO Safety Standards
- Maximum pressure: ≤2.5 bar
- Maximum temperature: ≤60°C
- Leakage limits: ≤0.1% volume

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Required packages**:
   - @radix-ui/react-* (for UI primitives)
   - recharts (for charts)
   - react-query (for data management)
   - lucide-react (for icons)

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Usage

### Navigation
The dashboard provides a sidebar navigation with the following sections:
- **Process Monitoring**: Real-time system overview
- **Quality Control**: BIS & PESO compliance tracking
- **Process Optimization**: Parameter tuning and optimization
- **Maintenance**: Equipment health and scheduling
- **Batch Management**: Production tracking and traceability

### Real-Time Features
- Live data updates every 5 seconds
- WebSocket connection status indicator
- Automatic fallback to demo mode when offline
- Real-time alarm notifications

### Quality Control Workflow
1. Continuous monitoring of gas quality parameters
2. Automated compliance checking against BIS/PESO standards
3. Quality test scheduling and result tracking
4. Certificate generation and management
5. Trend analysis and reporting

### Maintenance Workflow
1. Equipment health monitoring with predictive analytics
2. Maintenance task scheduling and assignment
3. Spare parts inventory management
4. Predictive failure alerts and recommendations
5. Maintenance history tracking

## Customization

### Adding New Parameters
To add new process parameters:
1. Update the `ProcessData` interface
2. Add parameter to mock data generators
3. Include in visualization components
4. Update alarm condition checks

### Extending Quality Standards
To add new quality standards:
1. Update `QualityStandards` interface
2. Add compliance checking logic
3. Include in certificate generation
4. Update quality trend analysis

## Performance Considerations

- Efficient data updates with React Query caching
- WebSocket connection management with reconnection logic
- Optimized chart rendering with Recharts
- Memory-efficient alarm system with auto-cleanup
- Responsive design for various screen sizes

## Security Features

- Real-time alarm system for critical conditions
- Equipment failure prediction and alerts
- Quality compliance monitoring and notifications
- Secure certificate generation with validation
- Audit trail for all operations

## Integration Points

### Backend Integration
- WebSocket endpoints for real-time data
- REST APIs for configuration and historical data
- Database integration for batch and quality records
- Certificate service integration

### External Systems
- BIS certification systems
- PESO compliance databases
- Equipment manufacturer APIs
- Laboratory information systems

## Future Enhancements

- Machine learning for predictive maintenance
- Advanced optimization algorithms
- Mobile responsiveness improvements
- Advanced reporting and analytics
- Integration with IoT sensors
- Blockchain-based certificate verification

---

*This dashboard implements all requirements specified in Story 17-2 and provides a comprehensive solution for purification unit operations management.*