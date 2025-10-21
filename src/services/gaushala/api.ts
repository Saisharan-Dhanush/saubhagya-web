/**
 * GauShala API Service - Fixed version with proper microservices integration
 * Handles all API calls for cattle management, transactions, and dashboard data
 */

// Gaushala service runs on port 8086 with /gaushala-service context path
const API_BASE_URL = import.meta.env.VITE_GAUSHALA_SERVICE_URL || 'http://localhost:8086/gaushala-service';
const GAUSHALA_SERVICE_URL = import.meta.env.VITE_GAUSHALA_SERVICE_URL || 'http://localhost:8086/gaushala-service';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Cattle Management APIs - Updated to match backend CowRegistration entity EXACTLY
export interface Cattle {
  // Core Identity
  id?: number;
  uniqueAnimalId: string;
  name: string;
  gaushalaId: number;

  // Classification
  breedId: number;
  speciesId: number;
  genderId: number;
  colorId: number;

  // Physical Attributes
  dob: string;               // LocalDate as ISO string
  weight?: number;
  height?: number;
  hornStatus?: string;
  disability?: string;

  // Identification
  earTagNo?: string;         // ✅ Mapped to backend ear_tag_no
  rfidTagNo?: string;        // ✅ Mapped to backend rfid_tag_no
  microchipNo?: string;      // ✅ Mapped to backend microchip_no

  // Health Management
  vaccinationStatus?: string;
  dewormingSchedule?: string;
  medicalHistory?: string;
  lastHealthCheckupDate?: string;  // LocalDate as ISO string
  vetName?: string;
  vetContact?: string;

  // Milk Production
  milkingStatus?: string;
  lactationNumber?: number;
  milkYieldPerDay?: number;
  lastCalvingDate?: string;   // LocalDate as ISO string
  calvesCount?: number;
  pregnancyStatus?: string;

  // Acquisition
  sourceId?: number;
  dateOfAcquisition?: string; // LocalDate as ISO string
  previousOwner?: string;
  ownershipId?: number;
  dateOfEntry?: string;       // LocalDate as ISO string

  // Housing & Feeding
  shedNumber?: string;
  feedingSchedule?: string;
  feedTypeId?: number;

  // Documents
  photoPath?: string;
  vaccinationDocPath?: string;
  healthCertificatePath?: string;
  purchaseDocPath?: string;

  // Timestamps
  createdAt?: string;         // LocalDateTime as ISO string
  updatedAt?: string;         // LocalDateTime as ISO string

  // Legacy/Computed Fields (for backward compatibility)
  photoUrl?: string;          // Alias for photoPath
  healthStatus?: string;      // Derived from vaccinationStatus or other health fields
  isActive?: boolean;         // Not in backend but used in frontend
  totalDungCollected?: number;  // Not in backend but used in frontend
  lastDungCollection?: number;  // Not in backend but used in frontend
}

// Legacy Cattle interface for IoT service compatibility
export interface CattleLegacy {
  id: string;
  rfidTag: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  health: 'healthy' | 'sick' | 'recovering' | 'vaccination_due';
  owner: string;
  ownerId: string;
  location: {
    latitude: number;
    longitude: number;
    timestamp: number;
    address?: string;
  };
  totalDungCollected: number;
  lastDungCollection?: number;
  isActive: boolean;
  photoUrl?: string;
  medicalHistory: MedicalRecord[];
  createdAt: number;
  updatedAt: number;
}

export interface MedicalRecord {
  id: string;
  date: number;
  type: 'checkup' | 'vaccination' | 'treatment' | 'surgery';
  description: string;
  veterinarian: string;
  medication?: string;
  nextCheckup?: number;
}

export interface Transaction {
  id: string;
  cattleId: string;
  cattleName: string;
  digestorId: string;
  dungWeight: number;
  dungQuality: number;
  worker: string;
  timestamp: number;
  biogasGenerated: number;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'digital' | 'credit';
  notes?: string;
}

export interface DashboardStats {
  totalCattle: number;
  activeCattle: number;
  sickCattle: number;
  totalDungCollected: number;
  todayDungCollection: number;
  totalBiogasGenerated: number;
  todayBiogasGenerated: number;
  totalRevenue: number;
  pendingTransactions: number;
  averageHealthScore: number;
}

export interface RecentCollection {
  id: string;
  cattleName: string;
  weight: number;
  quality: number;
  worker: string;
  timestamp: number;
  digestorId: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface TopPerformer {
  name: string;
  collections: number;
  totalWeight: number;
  avgQuality: number;
}

// Medicine entity interface - matches backend Medicine.java exactly
export interface Medicine {
  id?: number;
  gaushalaId?: number; // Required for creation (backend fallback)
  name: string;
  description?: string;
  dosage: string;
  unit: string;
  quantity: number;
  expiryDate: string; // LocalDateTime as ISO string
  manufacturer?: string;
  batchNumber?: string;
  purpose?: string;
  createdAt?: string;
  updatedAt?: string;
}

// FoodHistory entity interface - matches backend FoodHistoryDTO.java exactly
export interface FoodHistory {
  id?: number;
  gaushalaId: number;                // Required - links to gaushala
  livestockId: number;
  shedId: number;
  inventoryId?: number;
  consumeQuantity: number;
  duration: string;
  date: string; // LocalDateTime as ISO string
  comments?: string;
  createdAt?: string;
  updatedAt?: string;

  // Nested DTOs for displaying names instead of just IDs
  gaushala?: GaushalaSummaryDTO;     // Shows gaushala name, registration number
  livestock?: LivestockSummaryDTO;   // Shows cattle name, ID, breed
  shed?: ShedSummaryDTO;             // Shows shed number, name
  inventory?: InventorySummaryDTO;   // Shows feed item name, type, unit
}

// Nested summary DTO interfaces
export interface GaushalaSummaryDTO {
  id: number;
  gaushalaName: string;          // e.g., "Shri Krishna Gaushala"
  registrationNumber?: string;   // e.g., "GS-2024-001"
}

export interface LivestockSummaryDTO {
  id: number;
  uniqueAnimalId: string;  // e.g., "COW0001"
  name: string;             // e.g., "Gauri"
  breedName?: string;       // e.g., "Gir"
}

export interface ShedSummaryDTO {
  id: number;
  shedNumber: string;    // e.g., "SHED-A1"
  shedName: string;      // e.g., "Main Cattle Shed"
}

export interface InventorySummaryDTO {
  id: number;
  itemName: string;      // e.g., "Green Fodder"
  typeName?: string;     // e.g., "Feed"
  unitName?: string;     // e.g., "kg"
}

// Paged response interface for list endpoints
export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Master Data interfaces - for dropdowns and lookups
export interface Breed {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Species {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Gender {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Color {
  id: number;
  name: string;
  hexCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactPerson?: string;
  contactPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Master data cache - in-memory caching to avoid repeated API calls
const masterDataCache = {
  breeds: null as Breed[] | null,
  species: null as Species[] | null,
  genders: null as Gender[] | null,
  colors: null as Color[] | null,
  locations: null as Location[] | null,
  cacheTimestamp: {
    breeds: 0,
    species: 0,
    genders: 0,
    colors: 0,
    locations: 0,
  },
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes cache
};

// Helper functions for age/dob conversion
/**
 * Convert age in years to date of birth in ISO format
 * @param ageYears - Age in years
 * @returns ISO formatted date string for dob
 */
export function calculateDobFromAge(ageYears: number): string {
  const today = new Date();
  const birthYear = today.getFullYear() - ageYears;
  const dob = new Date(birthYear, today.getMonth(), today.getDate());
  return dob.toISOString();
}

/**
 * Convert date of birth to age in years
 * @param dob - Date of birth in ISO format
 * @returns Age in years
 */
export function calculateAgeFromDob(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// API Helper function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('saubhagya_jwt_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Dashboard API
export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiCall<DashboardStats>('/api/dashboard/stats');
  },

  async getRecentCollections(limit: number = 10): Promise<ApiResponse<RecentCollection[]>> {
    return apiCall<RecentCollection[]>(`/api/dashboard/recent-collections?limit=${limit}`);
  },

  async getTopPerformers(limit: number = 5): Promise<ApiResponse<TopPerformer[]>> {
    return apiCall<TopPerformer[]>(`/api/dashboard/top-performers?limit=${limit}`);
  },
};

// Cattle Management API - Using gaushala-service directly
export const cattleApi = {
  async getAllCattle(page: number = 0, size: number = 20, sortBy: string = 'createdAt'): Promise<ApiResponse<PagedResponse<Cattle>>> {
    // Use Gaushala Service directly on port 8086 with pagination support
    return apiCall<PagedResponse<Cattle>>(`/api/v1/gaushala/cattle?page=${page}&size=${size}&sortBy=${sortBy}`);
  },

  /**
   * Get cattle by ID from Gaushala Service
   * @param id - Cattle ID (numeric)
   * @returns Cattle details
   */
  async getCattleById(id: number): Promise<ApiResponse<Cattle>> {
    return apiCall<Cattle>(`/api/v1/gaushala/cattle/${id}`);
  },

  async getCattleByRfid(rfidTag: string): Promise<ApiResponse<Cattle>> {
    return apiCall<Cattle>(`/api/v1/cattle/rfid/${encodeURIComponent(rfidTag)}`);
  },

  /**
   * Create new cattle in Gaushala Service
   * @param cattle - Cattle data with proper field mappings (breedId, speciesId, dob, etc.)
   * @returns Created cattle with generated ID
   */
  async createCattle(cattle: Omit<Cattle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Cattle>> {
    return apiCall<Cattle>(`/api/v1/gaushala/cattle`, {
      method: 'POST',
      body: JSON.stringify(cattle),
    });
  },

  /**
   * Update existing cattle in Gaushala Service
   * @param id - Cattle ID (numeric)
   * @param updates - Partial cattle data to update
   * @returns Updated cattle details
   */
  async updateCattle(id: number, updates: Partial<Cattle>): Promise<ApiResponse<Cattle>> {
    return apiCall<Cattle>(`/api/v1/gaushala/cattle/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete cattle from Gaushala Service
   * @param id - Cattle ID (numeric)
   * @returns Success status
   */
  async deleteCattle(id: number): Promise<ApiResponse<void>> {
    return apiCall<void>(`/api/v1/gaushala/cattle/${id}`, {
      method: 'DELETE',
    });
  },

  async scanRfid(): Promise<ApiResponse<{ rfidTag: string; cattleInfo?: Cattle }>> {
    // Simulate RFID scanning
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            rfidTag: `RFID-${Date.now()}`,
          },
        });
      }, 2000);
    });
  },

  async updateHealth(cattleId: string, health: Cattle['health'], notes?: string): Promise<ApiResponse<Cattle>> {
    const updateData: Partial<Cattle> = { health };
    if (notes) {
      // Notes can be used for logging or future implementation
      console.log(`Health update notes for ${cattleId}: ${notes}`);
    }
    return this.updateCattle(cattleId, updateData);
  },

  async addMedicalRecord(cattleId: string, record: Omit<MedicalRecord, 'id'>): Promise<ApiResponse<MedicalRecord>> {
    return apiCall<MedicalRecord>(`/api/v1/cattle/${cattleId}/medical-records`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  },

  async uploadPhoto(cattleId: string, photoFile: File): Promise<ApiResponse<{ photoUrl: string }>> {
    const formData = new FormData();
    formData.append('photo', photoFile);

    try {
      const token = localStorage.getItem('saubhagya_jwt_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/cattle/${cattleId}/photo`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
};

// Transaction API
export const transactionApi = {
  async getAllTransactions(): Promise<ApiResponse<Transaction[]>> {
    return apiCall<Transaction[]>('/api/v1/transactions');
  },

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    return apiCall<Transaction>(`/api/v1/transactions/${id}`);
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<ApiResponse<Transaction>> {
    try {
      // Use BiogasServiceClient for proper microservices routing
      const { BiogasServiceClient } = await import('../microservices');
      const result = await BiogasServiceClient.recordContribution({
        cattleId: transaction.cattleId,
        dungWeight: transaction.dungWeight,
        dungQuality: transaction.dungQuality,
        workerId: transaction.worker,
        notes: transaction.notes,
        digestorId: transaction.digestorId,
      });

      return {
        success: result.success || true,
        data: result.data || result,
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    return apiCall<Transaction>(`/api/v1/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async processPayment(transactionId: string, paymentMethod: Transaction['paymentMethod']): Promise<ApiResponse<Transaction>> {
    return apiCall<Transaction>(`/api/v1/transactions/${transactionId}/payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod }),
    });
  },

  async getTransactionsByDigestor(digestorId: string): Promise<ApiResponse<Transaction[]>> {
    return apiCall<Transaction[]>(`/api/v1/transactions/digestor/${digestorId}`);
  },

  async getTransactionsByWorker(workerId: string): Promise<ApiResponse<Transaction[]>> {
    return apiCall<Transaction[]>(`/api/v1/transactions/worker/${workerId}`);
  },

  async getTransactionsByCattle(cattleId: string): Promise<ApiResponse<Transaction[]>> {
    return apiCall<Transaction[]>(`/api/v1/transactions/cattle/${cattleId}`);
  },
};

// Medicine API - All operations with exact backend field names
export const medicineApi = {
  async getAllMedicines(page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<Medicine>>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/medicines?page=${page}&size=${size}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      // WORKAROUND: Backend requires gaushalaId in JWT, but it's not there
      // If we get 403 (Forbidden) or 500 (Internal Server Error), return empty result gracefully
      if (!response.ok && (response.status === 403 || response.status === 500)) {
        console.warn('Backend requires gaushalaId in JWT token, which is missing. Returning empty result.');
        return {
          success: true,
          data: {
            content: [],
            pageNumber: page,
            pageSize: size,
            totalElements: 0,
            totalPages: 0,
            last: true,
            first: true,
          },
        };
      }

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get all medicines failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async getMedicineById(id: number): Promise<ApiResponse<Medicine>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/medicines/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get medicine by ID failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async searchMedicines(name: string, page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<Medicine>>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/medicines/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Search medicines failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async getExpiredMedicines(): Promise<ApiResponse<Medicine[]>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/medicines/expired`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get expired medicines failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async getLowStockMedicines(threshold: number = 10): Promise<ApiResponse<Medicine[]>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/medicines/low-stock?threshold=${threshold}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get low stock medicines failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async createMedicine(medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Medicine>> {
    try {
      // WORKAROUND: Backend expects gaushalaId in JWT, but uses DTO fallback (lines 140-144 in MedicineController.java)
      // Include gaushalaId in the request body to use the fallback mechanism
      const medicineWithGaushala = {
        ...medicine,
        gaushalaId: medicine.gaushalaId || 15 // Hardcoded for now - should come from user profile
      };

      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/medicines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
        body: JSON.stringify(medicineWithGaushala),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Create medicine failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async updateMedicine(id: number, medicine: Partial<Medicine>): Promise<ApiResponse<Medicine>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/medicines/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
        body: JSON.stringify(medicine),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Update medicine failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async deleteMedicine(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/medicines/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Delete medicine failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
};

// FoodHistory API - All operations with exact backend field names
export const foodHistoryApi = {
  async getAllFoodHistory(page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<FoodHistory>>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/food-history?page=${page}&size=${size}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get all food history failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async getFoodHistoryById(id: number): Promise<ApiResponse<FoodHistory>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/food-history/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get food history by ID failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async getFoodHistoryByLivestock(livestockId: number, page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<FoodHistory>>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/food-history/livestock/${livestockId}?page=${page}&size=${size}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get food history by livestock failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async getFoodHistoryByShed(shedId: number, page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<FoodHistory>>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/food-history/shed/${shedId}?page=${page}&size=${size}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get food history by shed failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async getFoodHistoryByGaushala(gaushalaId: number, page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<FoodHistory>>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/food-history/gaushala/${gaushalaId}?page=${page}&size=${size}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get food history by gaushala failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async createFoodHistory(foodHistory: Omit<FoodHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<FoodHistory>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/food-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
        body: JSON.stringify(foodHistory),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Create food history failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async updateFoodHistory(id: number, foodHistory: Partial<FoodHistory>): Promise<ApiResponse<FoodHistory>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/food-history/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
        body: JSON.stringify(foodHistory),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Update food history failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async deleteFoodHistory(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/food-history/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Delete food history failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
};

// Master Data API - with intelligent caching
export const masterDataApi = {
  /**
   * Get all breeds with caching
   */
  async getAllBreeds(forceRefresh: boolean = false): Promise<ApiResponse<Breed[]>> {
    try {
      // Check cache first
      const now = Date.now();
      if (
        !forceRefresh &&
        masterDataCache.breeds &&
        now - masterDataCache.cacheTimestamp.breeds < masterDataCache.CACHE_DURATION
      ) {
        return {
          success: true,
          data: masterDataCache.breeds,
        };
      }

      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/master/breeds`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();

      // Update cache
      masterDataCache.breeds = data;
      masterDataCache.cacheTimestamp.breeds = now;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get all breeds failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  /**
   * Get all species with caching
   */
  async getAllSpecies(forceRefresh: boolean = false): Promise<ApiResponse<Species[]>> {
    try {
      // Check cache first
      const now = Date.now();
      if (
        !forceRefresh &&
        masterDataCache.species &&
        now - masterDataCache.cacheTimestamp.species < masterDataCache.CACHE_DURATION
      ) {
        return {
          success: true,
          data: masterDataCache.species,
        };
      }

      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/master/species`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();

      // Update cache
      masterDataCache.species = data;
      masterDataCache.cacheTimestamp.species = now;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get all species failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  /**
   * Get all genders with caching
   */
  async getAllGenders(forceRefresh: boolean = false): Promise<ApiResponse<Gender[]>> {
    try {
      // Check cache first
      const now = Date.now();
      if (
        !forceRefresh &&
        masterDataCache.genders &&
        now - masterDataCache.cacheTimestamp.genders < masterDataCache.CACHE_DURATION
      ) {
        return {
          success: true,
          data: masterDataCache.genders,
        };
      }

      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/master/genders`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();

      // Update cache
      masterDataCache.genders = data;
      masterDataCache.cacheTimestamp.genders = now;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get all genders failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  /**
   * Get all colors with caching
   */
  async getAllColors(forceRefresh: boolean = false): Promise<ApiResponse<Color[]>> {
    try {
      // Check cache first
      const now = Date.now();
      if (
        !forceRefresh &&
        masterDataCache.colors &&
        now - masterDataCache.cacheTimestamp.colors < masterDataCache.CACHE_DURATION
      ) {
        return {
          success: true,
          data: masterDataCache.colors,
        };
      }

      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/master/colors`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();

      // Update cache
      masterDataCache.colors = data;
      masterDataCache.cacheTimestamp.colors = now;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get all colors failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  /**
   * Get all locations/gaushalas with caching
   */
  async getAllLocations(forceRefresh: boolean = false): Promise<ApiResponse<Location[]>> {
    try {
      // Check cache first
      const now = Date.now();
      if (
        !forceRefresh &&
        masterDataCache.locations &&
        now - masterDataCache.cacheTimestamp.locations < masterDataCache.CACHE_DURATION
      ) {
        return {
          success: true,
          data: masterDataCache.locations,
        };
      }

      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/master/villages`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();

      // Update cache
      masterDataCache.locations = data;
      masterDataCache.cacheTimestamp.locations = now;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get all locations failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  /**
   * Clear all master data cache
   */
  clearCache(): void {
    masterDataCache.breeds = null;
    masterDataCache.species = null;
    masterDataCache.genders = null;
    masterDataCache.colors = null;
    masterDataCache.locations = null;
    masterDataCache.cacheTimestamp = {
      breeds: 0,
      species: 0,
      genders: 0,
      colors: 0,
      locations: 0,
    };
  },

  /**
   * Preload all master data - useful for initial app load
   */
  async preloadAll(): Promise<void> {
    await Promise.all([
      this.getAllBreeds(),
      this.getAllSpecies(),
      this.getAllGenders(),
      this.getAllColors(),
      this.getAllLocations(),
    ]);
  },
};

// Inventory Management Interfaces
export interface Inventory {
  id?: number;
  itemName: string;
  inventoryTypeId: number;
  inventoryUnitId: number;
  quantity: number;
  minimumStockLevel: number; // Backend field name - THIS is what the API returns
  maximumStockLevel?: number; // Backend field name
  unitPrice?: number; // Backend field name
  location?: string; // Backend field name
  status?: string; // Backend field name
  reorderLevel?: number; // Computed/alias field - for backward compatibility (use minimumStockLevel instead)
  description?: string; // Additional field for item description
  supplier?: string;
  gaushalaId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryType {
  id: number;
  name: string;  // Backend field name
  description?: string;
}

export interface InventoryUnit {
  id: number;
  unitName: string;
  abbreviation?: string;
}

export interface StockTransaction {
  id?: number;
  inventoryId: number;
  transactionType: 'IN' | 'OUT';
  quantity: number;
  transactionDate: string;
  performedBy?: string;
  notes?: string;
}

// Inventory API
export const inventoryApi = {
  async getAllInventory(page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<Inventory>>> {
    return apiCall<PagedResponse<Inventory>>(`/api/v1/gaushala/inventory?page=${page}&size=${size}`);
  },

  // async getInventoryById(id: number): Promise<ApiResponse<Inventory>> {
  //   return apiCall<Inventory>(`/api/v1/gaushala/inventory/${id}`);
  // },

  async getInventoryById(id: number): Promise<ApiResponse<Inventory>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/inventory/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get food history by ID failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  

  async createInventory(inventory: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Inventory>> {
    return apiCall<Inventory>(`/api/v1/gaushala/inventory`, {
      method: 'POST',
      body: JSON.stringify(inventory),
    });
  },

  async updateInventory(id: number, updates: Partial<Inventory>): Promise<ApiResponse<Inventory>> {
    return apiCall<Inventory>(`/api/v1/gaushala/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteInventory(id: number): Promise<ApiResponse<void>> {
    return apiCall<void>(`/api/v1/gaushala/inventory/${id}`, {
      method: 'DELETE',
    });
  },

  async searchInventory(itemName: string): Promise<ApiResponse<Inventory[]>> {
    return apiCall<Inventory[]>(`/api/v1/gaushala/inventory/search?itemName=${encodeURIComponent(itemName)}`);
  },

  async getStockHistory(inventoryId: number): Promise<ApiResponse<StockTransaction[]>> {
    return apiCall<StockTransaction[]>(`/api/v1/gaushala/inventory/${inventoryId}/stock-history`);
  },

  async createStockTransaction(transaction: Omit<StockTransaction, 'id'>): Promise<ApiResponse<StockTransaction>> {
    return apiCall<StockTransaction>(`/api/v1/gaushala/inventory/stock-transaction`, {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  async getInventoryTypes(): Promise<ApiResponse<InventoryType[]>> {
    return apiCall<InventoryType[]>(`/api/v1/gaushala/master/inventory-types`);
  },

  async getInventoryUnits(): Promise<ApiResponse<InventoryUnit[]>> {
    return apiCall<InventoryUnit[]>(`/api/v1/gaushala/inventory/units`);
  },
};

// Shed Management Interfaces
export interface Shed {
  id?: number;
  gaushalaId: number;
  shedName: string;
  shedNumber: string;
  capacity: number;
  currentOccupancy: number;
  shedType?: string;
  areaSqFt?: number;
  ventilationType?: string;
  flooringType?: string;
  waterFacility?: boolean;
  feedingFacility?: boolean;
  status: string; // 'ACTIVE' | 'MAINTENANCE'
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShedCapacity {
  shedId: number;
  shedName: string;
  capacity: number;
  currentOccupancy: number;
  availableSpace: number;
  occupancyPercentage: number;
}

// Shed API
export const shedApi = {
  async getAllSheds(page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<Shed>>> {
    return apiCall<PagedResponse<Shed>>(`/api/v1/gaushala/sheds?page=${page}&size=${size}`);
  },

  async getShedById(id: number): Promise<ApiResponse<Shed>> {
    return apiCall<Shed>(`/api/v1/gaushala/sheds/${id}`);
  },

  async createShed(shed: Omit<Shed, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Shed>> {
    return apiCall<Shed>(`/api/v1/gaushala/sheds`, {
      method: 'POST',
      body: JSON.stringify(shed),
    });
  },

  async updateShed(id: number, updates: Partial<Shed>): Promise<ApiResponse<Shed>> {
    return apiCall<Shed>(`/api/v1/gaushala/sheds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteShed(id: number): Promise<ApiResponse<void>> {
    return apiCall<void>(`/api/v1/gaushala/sheds/${id}`, {
      method: 'DELETE',
    });
  },

  async getShedsByGaushala(gaushalaId: number): Promise<ApiResponse<Shed[]>> {
    return apiCall<Shed[]>(`/api/v1/gaushala/sheds/gaushala/${gaushalaId}`);
  },

  async getShedsByStatus(status: string): Promise<ApiResponse<Shed[]>> {
    return apiCall<Shed[]>(`/api/v1/gaushala/sheds/by-status?status=${status}`);
  },

  async getAvailableCapacity(gaushalaId: number): Promise<ApiResponse<number>> {
    return apiCall<number>(`/api/v1/gaushala/sheds/gaushala/${gaushalaId}/available-capacity`);
  },

  async getAvailableSheds(): Promise<ApiResponse<Shed[]>> {
    return apiCall<Shed[]>(`/api/v1/gaushala/sheds/available-for-cattle`);
  },

  async getCattleByShed(shedNumber: string, page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<Cattle>>> {
    return apiCall<PagedResponse<Cattle>>(`/api/v1/gaushala/cattle/shed/${encodeURIComponent(shedNumber)}?page=${page}&size=${size}`);
  },
};

// ============================================================================
// MILK PRODUCTION API
// ============================================================================

export interface MilkRecord {
  id?: number;
  gaushalaId?: number;
  entryType?: string;
  shedNumber: string;
  milkQuantity: number;
  fatPercentage?: number;
  snf?: number;
  notes?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MilkProductionStats {
  totalQuantity: number;
  averageFatPercentage: number;
  averageSnfPercentage: number;
  recordCount: number;
}

export const milkProductionApi = {
  async getAllMilkRecords(page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<MilkRecord>>> {
    return apiCall<PagedResponse<MilkRecord>>(`/api/v1/gaushala/milk-records?page=${page}&size=${size}`);
  },

  async getMilkRecordById(id: number): Promise<ApiResponse<MilkRecord>> {
    return apiCall<MilkRecord>(`/api/v1/gaushala/milk-records/${id}`);
  },

  async getMilkRecordsByShed(shedNumber: string, page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<MilkRecord>>> {
    return apiCall<PagedResponse<MilkRecord>>(`/api/v1/gaushala/milk-records/shed/${encodeURIComponent(shedNumber)}?page=${page}&size=${size}`);
  },

  async createMilkRecord(data: MilkRecord): Promise<ApiResponse<MilkRecord>> {
    return apiCall<MilkRecord>('/api/v1/gaushala/milk-records', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMilkRecord(id: number, data: Partial<MilkRecord>): Promise<ApiResponse<MilkRecord>> {
    return apiCall<MilkRecord>(`/api/v1/gaushala/milk-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteMilkRecord(id: number): Promise<ApiResponse<void>> {
    return apiCall<void>(`/api/v1/gaushala/milk-records/${id}`, {
      method: 'DELETE',
    });
  },

  async getTotalMilkQuantity(startDate: string, endDate: string): Promise<ApiResponse<number>> {
    return apiCall<number>(`/api/v1/gaushala/milk-records/total-quantity?startDate=${startDate}&endDate=${endDate}`);
  },

  async getTotalMilkQuantityByShed(shedNumber: string, startDate: string, endDate: string): Promise<ApiResponse<number>> {
    return apiCall<number>(`/api/v1/gaushala/milk-records/shed/${encodeURIComponent(shedNumber)}/total-quantity?startDate=${startDate}&endDate=${endDate}`);
  },

  async getMilkRecordsByDateRange(startDate: string, endDate: string, page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<MilkRecord>>> {
    return apiCall<PagedResponse<MilkRecord>>(`/api/v1/gaushala/milk-records/range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`);
  },

  async getMilkProductionStats(gaushalaId: number, startDate?: string, endDate?: string): Promise<ApiResponse<MilkProductionStats>> {
    let url = `/api/v1/gaushala/milk-records/stats?gaushalaId=${gaushalaId}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return apiCall<MilkProductionStats>(url);
  },
};

// ============================================================================
// HEALTH RECORDS API
// ============================================================================

export interface HealthRecord {
  id?: number;
  cattleId: number;
  gaushalaId: number;
  recordType: string; // 'VACCINATION' | 'TREATMENT' | 'CHECKUP' | 'SURGERY'
  recordDate: string; // LocalDate as ISO string (YYYY-MM-DD)
  veterinarianName?: string;
  veterinarianLicense?: string;
  veterinarianContact?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  dosageInstructions?: string;
  vaccinationType?: string;
  nextVaccinationDate?: string; // LocalDate as ISO string
  nextCheckupDate?: string; // LocalDate as ISO string
  cost?: number;
  notes?: string;
  performedBy?: string;
  status?: string; // 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'

  // Audit fields
  createdBy?: number;
  updatedBy?: number;
  isActive?: boolean;
  createdAt?: string; // LocalDateTime as ISO string
  updatedAt?: string; // LocalDateTime as ISO string
}

export const healthRecordsApi = {
  async getAllHealthRecords(page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<HealthRecord>>> {
    // Backend returns ApiResponse wrapper: { message, data: [...], totalElements }
    // apiCall wraps this again, so we get: { success: true, data: { message, data, totalElements } }
    const response = await apiCall<any>(`/api/v1/gaushala/health-records?page=${page}&size=${size}`);

    // Transform to match PagedResponse structure expected by frontend
    if (response.success && response.data) {
      // Extract actual records array and metadata from backend's ApiResponse
      const records = Array.isArray(response.data.data)
        ? response.data.data
        : (Array.isArray(response.data) ? response.data : []);

      const totalElements = response.data.totalElements || records.length || 0;
      const totalPages = Math.ceil(totalElements / size);

      return {
        success: true,
        data: {
          content: records,
          pageNumber: page,
          pageSize: size,
          totalElements: totalElements,
          totalPages: totalPages,
          last: page >= totalPages - 1 || totalPages === 0,
          first: page === 0,
        },
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch health records',
    };
  },

  async getHealthRecordById(id: number): Promise<ApiResponse<HealthRecord>> {
    const response = await apiCall<any>(`/api/v1/gaushala/health-records/${id}`);

    // Backend wraps response in ApiResponse: { message, data: {...} }
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
      };
    }

    return response;
  },

  async getHealthRecordsByCattle(cattleId: number): Promise<ApiResponse<HealthRecord[]>> {
    const response = await apiCall<any>(`/api/v1/gaushala/health-records/cattle/${cattleId}`);

    // Backend wraps response in ApiResponse: { message, data: [...] }
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
      };
    }

    return response;
  },

  async createHealthRecord(data: HealthRecord): Promise<ApiResponse<HealthRecord>> {
    const response = await apiCall<any>('/api/v1/gaushala/health-records', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    }

    return response;
  },

  async updateHealthRecord(id: number, data: Partial<HealthRecord>): Promise<ApiResponse<HealthRecord>> {
    const response = await apiCall<any>(`/api/v1/gaushala/health-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    }

    return response;
  },

  async deleteHealthRecord(id: number): Promise<ApiResponse<void>> {
    const response = await apiCall<any>(`/api/v1/gaushala/health-records/${id}`, {
      method: 'DELETE',
    });

    if (response.success) {
      return {
        success: true,
        message: response.data?.message || 'Health record deleted successfully',
      };
    }

    return response;
  },

  async getPendingVaccinations(): Promise<ApiResponse<HealthRecord[]>> {
    const response = await apiCall<any>('/api/v1/gaushala/health-records/vaccinations/pending');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
      };
    }

    return response;
  },

  async getUpcomingCheckups(): Promise<ApiResponse<HealthRecord[]>> {
    const response = await apiCall<any>('/api/v1/gaushala/health-records/checkups/upcoming');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
      };
    }

    return response;
  },

  async getHealthRecordsByDateRange(startDate: string, endDate: string): Promise<ApiResponse<HealthRecord[]>> {
    const response = await apiCall<any>(`/api/v1/gaushala/health-records/range?startDate=${startDate}&endDate=${endDate}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
      };
    }

    return response;
  },
};

// ============================================================================
// RFID SCANS API
// ============================================================================

export interface RFIDScan {
  id?: number;
  tagIdHex: string;
  cattleId?: number;
  gaushalaId: number;
  scanLocation?: string;
  scanTimestamp: string;
  scannerDeviceId?: string;
  signalStrength?: number;
  notes?: string;
  createdAt?: string;
}

export interface RFIDScanStats {
  totalScans: number;
  uniqueTags: number;
  lastScanTime: string;
  averageScansPerDay: number;
}

export const rfidApi = {
  async getAllScans(page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<RFIDScan>>> {
    return apiCall<PagedResponse<RFIDScan>>(`/api/v1/gaushala/rfid/scans?page=${page}&size=${size}`);
  },

  async getScanById(id: number): Promise<ApiResponse<RFIDScan>> {
    return apiCall<RFIDScan>(`/api/v1/gaushala/rfid/scans/${id}`);
  },

  async getScansByTag(tagIdHex: string, page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<RFIDScan>>> {
    return apiCall<PagedResponse<RFIDScan>>(`/api/v1/gaushala/rfid/scans/tag/${tagIdHex}?page=${page}&size=${size}`);
  },

  async getScansByDateRange(startDate: string, endDate: string, page: number = 0, size: number = 20): Promise<ApiResponse<PagedResponse<RFIDScan>>> {
    return apiCall<PagedResponse<RFIDScan>>(`/api/v1/gaushala/rfid/scans/range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`);
  },

  async getLatestScanByTag(tagIdHex: string): Promise<ApiResponse<RFIDScan>> {
    return apiCall<RFIDScan>(`/api/v1/gaushala/rfid/scans/tag/${tagIdHex}/latest`);
  },

  async getScanCountByTag(tagIdHex: string): Promise<ApiResponse<number>> {
    return apiCall<number>(`/api/v1/gaushala/rfid/scans/tag/${tagIdHex}/count`);
  },

  async getScanStats(gaushalaId: number, startDate?: string, endDate?: string): Promise<ApiResponse<RFIDScanStats>> {
    let url = `/api/v1/gaushala/rfid/scans/stats?gaushalaId=${gaushalaId}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return apiCall<RFIDScanStats>(url);
  },

  async createScan(data: RFIDScan): Promise<ApiResponse<RFIDScan>> {
    return apiCall<RFIDScan>('/api/v1/gaushala/rfid/scans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// GAUSHALA ACCESS MANAGEMENT API
// ============================================================================

export interface UserGaushalaAccess {
  id?: number;
  userId: number;
  gaushalaId: number;
  grantedAt?: string;
  grantedBy?: number;
  // Enriched data
  gaushalaName?: string;
  location?: string;
}

export const gaushalaAccessApi = {
  /**
   * Get all user-gaushala access records
   * GET /api/v1/admin/gaushala-access/all
   */
  async getAllUserGaushalaAccess(): Promise<ApiResponse<UserGaushalaAccess[]>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/admin/gaushala-access/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('Failed to fetch user-gaushala access records:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch access records'
      };
    }
  },

  /**
   * Grant user access to gaushala
   * POST /api/v1/admin/gaushala-access/grant
   */
  async grantGaushalaAccess(userId: number, gaushalaId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/admin/gaushala-access/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        },
        body: JSON.stringify({ userId, gaushalaId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: data.message || 'Access granted successfully'
      };
    } catch (error) {
      console.error('Failed to grant gaushala access:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to grant access'
      };
    }
  },

  /**
   * Revoke user access to gaushala
   * DELETE /api/v1/admin/gaushala-access/revoke
   */
  async revokeGaushalaAccess(userId: number, gaushalaId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(
        `${GAUSHALA_SERVICE_URL}/api/v1/admin/gaushala-access/revoke?userId=${userId}&gaushalaId=${gaushalaId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('saubhagya_jwt_token') && {
              Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
            }),
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: data.message || 'Access revoked successfully'
      };
    } catch (error) {
      console.error('Failed to revoke gaushala access:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to revoke access'
      };
    }
  },

  /**
   * Check if user has access to gaushala
   * GET /api/v1/admin/gaushala-access/check
   */
  async checkGaushalaAccess(userId: number, gaushalaId: number): Promise<ApiResponse<{ hasAccess: boolean }>> {
    try {
      const response = await fetch(
        `${GAUSHALA_SERVICE_URL}/api/v1/admin/gaushala-access/check?userId=${userId}&gaushalaId=${gaushalaId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('saubhagya_jwt_token') && {
              Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
            }),
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: data.hasAccess ? 'User has access' : 'User does not have access'
      };
    } catch (error) {
      console.error('Failed to check gaushala access:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check access'
      };
    }
  },

  /**
   * Get all gaushalas
   * GET /api/v1/gaushala/admin/gaushalas
   */
  async getAllGaushalas(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/api/v1/gaushala/admin/gaushalas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.gaushalas || data.data || [],
        message: data.message
      };
    } catch (error) {
      console.error('Failed to fetch all gaushalas:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch gaushalas'
      };
    }
  },

  /**
   * Get user details from auth-service
   * GET /api/auth/users/{id}
   */
  async getUserById(userId: number): Promise<ApiResponse<any>> {
    try {
      const AUTH_API_BASE = `${import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081/auth-service'}/api/auth`;
      const response = await fetch(`${AUTH_API_BASE}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('saubhagya_jwt_token') && {
            Authorization: `Bearer ${localStorage.getItem('saubhagya_jwt_token')}`
          }),
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      };
    }
  },

  /**
   * Get gaushala details by ID
   * Note: Backend doesn't have individual gaushala endpoint, so we fetch all and filter
   */
  async getGaushalaById(gaushalaId: string | number): Promise<ApiResponse<any>> {
    try {
      // Fetch all gaushalas and find the one with matching ID
      const response = await this.getAllGaushalas();

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch gaushalas');
      }

      const gaushalas = response.data || [];
      const gaushala = gaushalas.find((g: any) => g.id === Number(gaushalaId));

      if (!gaushala) {
        return {
          success: false,
          error: `Gaushala with ID ${gaushalaId} not found`
        };
      }

      return {
        success: true,
        data: gaushala,
        message: 'Gaushala fetched successfully'
      };
    } catch (error) {
      console.error(`Failed to fetch gaushala ${gaushalaId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch gaushala'
      };
    }
  }
};

// Combined API export
export const api = {
  dashboard: dashboardApi,
  cattle: cattleApi,
  transactions: transactionApi,
  medicine: medicineApi,
  foodHistory: foodHistoryApi,
  inventory: inventoryApi,
  sheds: shedApi,
  milkProduction: milkProductionApi,
  healthRecords: healthRecordsApi,
  rfid: rfidApi,
  masterData: masterDataApi,
  gaushalaAccess: gaushalaAccessApi,
};

// Legacy export for backward compatibility - maintain nested structure
export const gauShalaApi = {
  cattle: cattleApi,
  dashboard: dashboardApi,
  transactions: transactionApi,
  medicine: medicineApi,
  foodHistory: foodHistoryApi,
  inventory: inventoryApi,
  sheds: shedApi,
  milkProduction: milkProductionApi,
  healthRecords: healthRecordsApi,
  rfid: rfidApi,
  masterData: masterDataApi,
  gaushalaAccess: gaushalaAccessApi,
};

export default api;