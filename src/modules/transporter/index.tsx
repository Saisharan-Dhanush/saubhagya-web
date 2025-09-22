import TransporterContainer from './Transporter.container';
export default TransporterContainer;
export { default as TransporterModule } from './Transporter.container';

// Export individual pages for direct access if needed
export { Dashboard as TransporterDashboard } from './pages/Dashboard/Dashboard';
export { ScheduleManager as TransporterScheduleManager } from './pages/ScheduleManager/ScheduleManager';
export { RouteOptimization as TransporterRouteOptimization } from './pages/RouteOptimization/RouteOptimization';
export { ActiveDeliveries as TransporterActiveDeliveries } from './pages/ActiveDeliveries/ActiveDeliveries';
export { DeliveryConfirmation as TransporterDeliveryConfirmation } from './pages/DeliveryConfirmation/DeliveryConfirmation';
export { VehicleManagement as TransporterVehicleManagement } from './pages/VehicleManagement/VehicleManagement';
export { DeliveryHistory as TransporterDeliveryHistory } from './pages/DeliveryHistory/DeliveryHistory';

// Export types for external use
export type {
  Vehicle,
  Driver,
  DeliverySchedule,
  Route,
  Delivery,
  DashboardStats,
  AlertNotification,
  DeliveryMetrics,
  OptimizationSettings,
  CustomerFeedback,
  ApiResponse,
  PaginatedResponse,
  DeliveryFilter,
  VehicleFilter
} from './types';

// Export services for external use
export { transporterService, TransporterMockService } from './services/mockDataService';