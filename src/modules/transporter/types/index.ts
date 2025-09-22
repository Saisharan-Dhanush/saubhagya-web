/**
 * TypeScript interfaces and types for the Transporter module
 * Following SAUB-FE-002 specifications for biogas transport management
 */

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: 'truck' | 'van' | 'tanker';
  capacity: number; // in liters or kg
  status: 'active' | 'maintenance' | 'inactive';
  currentLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  fuelLevel?: number; // percentage
  maintenanceDue?: string; // ISO date string
  driverId?: string;
  assignedRoute?: string;
  operatingHours: {
    start: string;
    end: string;
  };
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  email?: string;
  status: 'available' | 'on_delivery' | 'off_duty';
  currentVehicleId?: string;
  rating: number; // 1-5 scale
  totalDeliveries: number;
  joinDate: string;
}

export interface DeliverySchedule {
  id: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  deliveryDate: string; // ISO date string
  timeSlot: {
    start: string;
    end: string;
  };
  biogasQuantity: number; // in kg or liters
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  vehicleId?: string;
  driverId?: string;
  routeId?: string;
  specialInstructions?: string;
  estimatedDuration: number; // in minutes
  cost: number;
}

export interface Route {
  id: string;
  name: string;
  startLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  endLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  waypoints: Array<{
    latitude: number;
    longitude: number;
    address: string;
    deliveryId: string;
    estimatedArrival: string;
  }>;
  totalDistance: number; // in km
  estimatedDuration: number; // in minutes
  fuelCost: number;
  tollCost: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  optimizationScore: number; // 1-100 scale
  assignedVehicleId?: string;
  assignedDriverId?: string;
}

export interface Delivery {
  id: string;
  scheduleId: string;
  customerName: string;
  customerAddress: string;
  biogasQuantity: number;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  vehicleId: string;
  driverId: string;
  routeId: string;
  startTime?: string; // ISO date string
  estimatedArrival: string;
  actualArrival?: string;
  deliveryConfirmation?: {
    confirmedAt: string;
    confirmedBy: string;
    customerSignature?: string;
    photo?: string;
    notes?: string;
  };
  trackingUpdates: Array<{
    timestamp: string;
    location: {
      latitude: number;
      longitude: number;
    };
    status: string;
    notes?: string;
  }>;
}

export interface DeliveryMetrics {
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  failedDeliveries: number;
  onTimeDeliveryRate: number; // percentage
  averageDeliveryTime: number; // in minutes
  customerSatisfactionScore: number; // 1-5 scale
  fuelEfficiency: number; // km per liter
  revenueGenerated: number;
  operatingCosts: number;
}

export interface OptimizationSettings {
  prioritizeBy: 'time' | 'distance' | 'fuel_cost' | 'customer_priority';
  maxDeliveriesPerRoute: number;
  maxDistancePerRoute: number; // in km
  considerTrafficConditions: boolean;
  considerVehicleCapacity: boolean;
  considerDriverPreferences: boolean;
  operatingHours: {
    start: string;
    end: string;
  };
}

export interface CustomerFeedback {
  id: string;
  deliveryId: string;
  customerId: string;
  rating: number; // 1-5 scale
  comments?: string;
  submittedAt: string;
  driverId: string;
  vehicleId: string;
}

// Dashboard specific types
export interface DashboardStats {
  activeDeliveries: number;
  completedToday: number;
  pendingSchedules: number;
  vehiclesOnRoute: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  revenueToday: number;
  fuelConsumption: number;
}

export interface AlertNotification {
  id: string;
  type: 'delivery_delay' | 'vehicle_breakdown' | 'route_issue' | 'customer_complaint' | 'maintenance_due';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  relatedEntityId?: string; // vehicle, delivery, or route ID
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter and search types
export interface DeliveryFilter {
  status?: Delivery['status'][];
  dateRange?: {
    start: string;
    end: string;
  };
  vehicleId?: string;
  driverId?: string;
  priority?: DeliverySchedule['priority'][];
}

export interface VehicleFilter {
  status?: Vehicle['status'][];
  type?: Vehicle['type'][];
  maintenanceDue?: boolean;
}

// Form types for creating/editing
export type CreateDeliverySchedule = Omit<DeliverySchedule, 'id' | 'status'>;
export type UpdateDeliverySchedule = Partial<DeliverySchedule>;
export type CreateVehicle = Omit<Vehicle, 'id' | 'status' | 'currentLocation'>;
export type UpdateVehicle = Partial<Vehicle>;