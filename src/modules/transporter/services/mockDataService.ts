/**
 * Mock Data Service for Transporter Module
 * Provides realistic sample data for development and testing
 */

import {
  Vehicle,
  Driver,
  DeliverySchedule,
  Route,
  Delivery,
  DashboardStats,
  AlertNotification,
  DeliveryMetrics,
  CustomerFeedback,
  ApiResponse,
  PaginatedResponse
} from '../types';

// Mock Vehicles Data
export const mockVehicles: Vehicle[] = [
  {
    id: 'v001',
    registrationNumber: 'MH12AB1234',
    type: 'tanker',
    capacity: 2000,
    status: 'active',
    currentLocation: {
      latitude: 18.5204,
      longitude: 73.8567,
      address: 'Pune, Maharashtra'
    },
    fuelLevel: 75,
    maintenanceDue: '2024-10-15',
    driverId: 'd001',
    assignedRoute: 'r001',
    operatingHours: {
      start: '06:00',
      end: '18:00'
    }
  },
  {
    id: 'v002',
    registrationNumber: 'MH14CD5678',
    type: 'truck',
    capacity: 1500,
    status: 'active',
    currentLocation: {
      latitude: 18.5679,
      longitude: 73.9143,
      address: 'Kharadi, Pune'
    },
    fuelLevel: 45,
    driverId: 'd002',
    assignedRoute: 'r002',
    operatingHours: {
      start: '07:00',
      end: '19:00'
    }
  },
  {
    id: 'v003',
    registrationNumber: 'MH09EF9101',
    type: 'van',
    capacity: 800,
    status: 'maintenance',
    currentLocation: {
      latitude: 18.4088,
      longitude: 73.8878,
      address: 'Service Center, Pune'
    },
    fuelLevel: 20,
    maintenanceDue: '2024-09-25',
    operatingHours: {
      start: '08:00',
      end: '16:00'
    }
  }
];

// Mock Drivers Data
export const mockDrivers: Driver[] = [
  {
    id: 'd001',
    name: 'Rajesh Kumar',
    licenseNumber: 'MH0520230001',
    phoneNumber: '+91-9876543210',
    email: 'rajesh.kumar@saubhagya.com',
    status: 'on_delivery',
    currentVehicleId: 'v001',
    rating: 4.8,
    totalDeliveries: 145,
    joinDate: '2023-01-15'
  },
  {
    id: 'd002',
    name: 'Amit Sharma',
    licenseNumber: 'MH0520230002',
    phoneNumber: '+91-9876543211',
    email: 'amit.sharma@saubhagya.com',
    status: 'available',
    currentVehicleId: 'v002',
    rating: 4.6,
    totalDeliveries: 132,
    joinDate: '2023-02-20'
  },
  {
    id: 'd003',
    name: 'Suresh Patil',
    licenseNumber: 'MH0520230003',
    phoneNumber: '+91-9876543212',
    status: 'off_duty',
    rating: 4.9,
    totalDeliveries: 198,
    joinDate: '2022-11-10'
  }
];

// Mock Delivery Schedules
export const mockSchedules: DeliverySchedule[] = [
  {
    id: 's001',
    customerName: 'Ram Enterprises',
    customerAddress: '123 Main Street, Hadapsar, Pune - 411028',
    customerPhone: '+91-9876543213',
    deliveryDate: '2024-09-23',
    timeSlot: {
      start: '09:00',
      end: '11:00'
    },
    biogasQuantity: 500,
    priority: 'high',
    status: 'confirmed',
    vehicleId: 'v001',
    driverId: 'd001',
    routeId: 'r001',
    specialInstructions: 'Handle with care - industrial grade biogas',
    estimatedDuration: 45,
    cost: 12500
  },
  {
    id: 's002',
    customerName: 'Green Tech Solutions',
    customerAddress: '456 Tech Park, Magarpatta, Pune - 411013',
    customerPhone: '+91-9876543214',
    deliveryDate: '2024-09-23',
    timeSlot: {
      start: '14:00',
      end: '16:00'
    },
    biogasQuantity: 300,
    priority: 'medium',
    status: 'scheduled',
    estimatedDuration: 30,
    cost: 7500
  },
  {
    id: 's003',
    customerName: 'Eco Home Resort',
    customerAddress: '789 Hill Station Road, Lonavala - 410401',
    customerPhone: '+91-9876543215',
    deliveryDate: '2024-09-24',
    timeSlot: {
      start: '08:00',
      end: '10:00'
    },
    biogasQuantity: 750,
    priority: 'urgent',
    status: 'scheduled',
    specialInstructions: 'Mountain road - use experienced driver',
    estimatedDuration: 90,
    cost: 18750
  }
];

// Mock Routes
export const mockRoutes: Route[] = [
  {
    id: 'r001',
    name: 'Pune Industrial Route',
    startLocation: {
      latitude: 18.5204,
      longitude: 73.8567,
      address: 'SAUBHAGYA Biogas Plant, Pune'
    },
    endLocation: {
      latitude: 18.5679,
      longitude: 73.9143,
      address: 'Industrial Area, Pune'
    },
    waypoints: [
      {
        latitude: 18.5400,
        longitude: 73.8800,
        address: '123 Main Street, Hadapsar, Pune',
        deliveryId: 's001',
        estimatedArrival: '2024-09-23T09:30:00Z'
      }
    ],
    totalDistance: 25.5,
    estimatedDuration: 45,
    fuelCost: 850,
    tollCost: 120,
    status: 'active',
    optimizationScore: 85,
    assignedVehicleId: 'v001',
    assignedDriverId: 'd001'
  },
  {
    id: 'r002',
    name: 'Tech Park Circuit',
    startLocation: {
      latitude: 18.5204,
      longitude: 73.8567,
      address: 'SAUBHAGYA Biogas Plant, Pune'
    },
    endLocation: {
      latitude: 18.5170,
      longitude: 73.9300,
      address: 'Magarpatta Tech Park'
    },
    waypoints: [
      {
        latitude: 18.5150,
        longitude: 73.9280,
        address: '456 Tech Park, Magarpatta, Pune',
        deliveryId: 's002',
        estimatedArrival: '2024-09-23T14:15:00Z'
      }
    ],
    totalDistance: 18.2,
    estimatedDuration: 30,
    fuelCost: 650,
    tollCost: 80,
    status: 'planned',
    optimizationScore: 92,
    assignedVehicleId: 'v002',
    assignedDriverId: 'd002'
  }
];

// Mock Active Deliveries
export const mockActiveDeliveries: Delivery[] = [
  {
    id: 'del001',
    scheduleId: 's001',
    customerName: 'Ram Enterprises',
    customerAddress: '123 Main Street, Hadapsar, Pune - 411028',
    biogasQuantity: 500,
    status: 'in_transit',
    vehicleId: 'v001',
    driverId: 'd001',
    routeId: 'r001',
    startTime: '2024-09-23T08:30:00Z',
    estimatedArrival: '2024-09-23T09:30:00Z',
    trackingUpdates: [
      {
        timestamp: '2024-09-23T08:30:00Z',
        location: { latitude: 18.5204, longitude: 73.8567 },
        status: 'Departed from biogas plant',
        notes: 'Vehicle loaded with 500kg biogas'
      },
      {
        timestamp: '2024-09-23T08:45:00Z',
        location: { latitude: 18.5300, longitude: 73.8700 },
        status: 'En route to destination',
        notes: 'Traffic conditions normal'
      }
    ]
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  activeDeliveries: 8,
  completedToday: 12,
  pendingSchedules: 15,
  vehiclesOnRoute: 6,
  averageDeliveryTime: 42,
  onTimeDeliveryRate: 94.5,
  revenueToday: 125000,
  fuelConsumption: 245.8
};

// Mock Alerts
export const mockAlerts: AlertNotification[] = [
  {
    id: 'alert001',
    type: 'delivery_delay',
    severity: 'medium',
    title: 'Delivery Running Late',
    message: 'Delivery to Ram Enterprises is 15 minutes behind schedule',
    timestamp: '2024-09-23T09:45:00Z',
    isRead: false,
    actionRequired: true,
    relatedEntityId: 'del001'
  },
  {
    id: 'alert002',
    type: 'vehicle_breakdown',
    severity: 'high',
    title: 'Vehicle Maintenance Required',
    message: 'Vehicle MH09EF9101 requires immediate maintenance',
    timestamp: '2024-09-23T07:30:00Z',
    isRead: true,
    actionRequired: true,
    relatedEntityId: 'v003'
  },
  {
    id: 'alert003',
    type: 'maintenance_due',
    severity: 'low',
    title: 'Scheduled Maintenance Due',
    message: 'Vehicle MH12AB1234 has maintenance due in 3 days',
    timestamp: '2024-09-23T06:00:00Z',
    isRead: false,
    actionRequired: false,
    relatedEntityId: 'v001'
  }
];

// Mock Delivery Metrics
export const mockDeliveryMetrics: DeliveryMetrics = {
  totalDeliveries: 1247,
  completedDeliveries: 1198,
  pendingDeliveries: 23,
  failedDeliveries: 26,
  onTimeDeliveryRate: 94.5,
  averageDeliveryTime: 42,
  customerSatisfactionScore: 4.6,
  fuelEfficiency: 8.5,
  revenueGenerated: 2485000,
  operatingCosts: 1680000
};

// Mock Customer Feedback
export const mockCustomerFeedback: CustomerFeedback[] = [
  {
    id: 'feedback001',
    deliveryId: 'del001',
    customerId: 'cust001',
    rating: 5,
    comments: 'Excellent service! Driver was very professional and delivery was on time.',
    submittedAt: '2024-09-22T16:30:00Z',
    driverId: 'd001',
    vehicleId: 'v001'
  },
  {
    id: 'feedback002',
    deliveryId: 'del002',
    customerId: 'cust002',
    rating: 4,
    comments: 'Good service overall, but arrived 10 minutes late.',
    submittedAt: '2024-09-22T14:45:00Z',
    driverId: 'd002',
    vehicleId: 'v002'
  }
];

// Mock API Service Class
export class TransporterMockService {
  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await this.delay(500);
    return {
      success: true,
      data: mockDashboardStats
    };
  }

  async getAlerts(): Promise<ApiResponse<AlertNotification[]>> {
    await this.delay(300);
    return {
      success: true,
      data: mockAlerts
    };
  }

  // Vehicle APIs
  async getVehicles(): Promise<ApiResponse<Vehicle[]>> {
    await this.delay(400);
    return {
      success: true,
      data: mockVehicles
    };
  }

  async getVehicleById(id: string): Promise<ApiResponse<Vehicle | null>> {
    await this.delay(200);
    const vehicle = mockVehicles.find(v => v.id === id);
    return {
      success: true,
      data: vehicle || null
    };
  }

  // Driver APIs
  async getDrivers(): Promise<ApiResponse<Driver[]>> {
    await this.delay(400);
    return {
      success: true,
      data: mockDrivers
    };
  }

  // Schedule APIs
  async getSchedules(): Promise<ApiResponse<DeliverySchedule[]>> {
    await this.delay(500);
    return {
      success: true,
      data: mockSchedules
    };
  }

  async getSchedulesPaginated(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<DeliverySchedule>>> {
    await this.delay(500);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = mockSchedules.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        data,
        total: mockSchedules.length,
        page,
        limit,
        totalPages: Math.ceil(mockSchedules.length / limit)
      }
    };
  }

  // Route APIs
  async getRoutes(): Promise<ApiResponse<Route[]>> {
    await this.delay(400);
    return {
      success: true,
      data: mockRoutes
    };
  }

  async optimizeRoute(routeId: string): Promise<ApiResponse<Route>> {
    await this.delay(2000); // Simulate optimization processing
    const route = mockRoutes.find(r => r.id === routeId);
    if (route) {
      // Simulate optimization improvement
      route.optimizationScore = Math.min(100, route.optimizationScore + 5);
      route.totalDistance = route.totalDistance * 0.95; // 5% improvement
      route.estimatedDuration = Math.floor(route.estimatedDuration * 0.95);
    }
    return {
      success: true,
      data: route!,
      message: 'Route optimized successfully'
    };
  }

  // Delivery APIs
  async getActiveDeliveries(): Promise<ApiResponse<Delivery[]>> {
    await this.delay(400);
    return {
      success: true,
      data: mockActiveDeliveries
    };
  }

  async getDeliveryHistory(): Promise<ApiResponse<Delivery[]>> {
    await this.delay(500);
    // Return completed deliveries (mock)
    const completedDeliveries = mockActiveDeliveries.map(d => ({
      ...d,
      status: 'delivered' as const,
      actualArrival: '2024-09-22T10:15:00Z',
      deliveryConfirmation: {
        confirmedAt: '2024-09-22T10:15:00Z',
        confirmedBy: 'Customer Signature',
        notes: 'Delivered successfully'
      }
    }));

    return {
      success: true,
      data: completedDeliveries
    };
  }

  async confirmDelivery(deliveryId: string, confirmationData: any): Promise<ApiResponse<Delivery>> {
    await this.delay(300);
    const delivery = mockActiveDeliveries.find(d => d.id === deliveryId);
    if (delivery) {
      delivery.status = 'delivered';
      delivery.actualArrival = new Date().toISOString();
      delivery.deliveryConfirmation = {
        confirmedAt: new Date().toISOString(),
        confirmedBy: confirmationData.confirmedBy || 'Driver',
        notes: confirmationData.notes || 'Delivered successfully',
        customerSignature: confirmationData.signature,
        photo: confirmationData.photo
      };
    }
    return {
      success: true,
      data: delivery!,
      message: 'Delivery confirmed successfully'
    };
  }

  // Metrics APIs
  async getDeliveryMetrics(): Promise<ApiResponse<DeliveryMetrics>> {
    await this.delay(600);
    return {
      success: true,
      data: mockDeliveryMetrics
    };
  }

  // Feedback APIs
  async getCustomerFeedback(): Promise<ApiResponse<CustomerFeedback[]>> {
    await this.delay(400);
    return {
      success: true,
      data: mockCustomerFeedback
    };
  }
}

// Export singleton instance
export const transporterService = new TransporterMockService();