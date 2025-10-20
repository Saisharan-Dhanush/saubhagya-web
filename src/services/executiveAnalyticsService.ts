import type {
  ExecutiveKPI,
  PredictiveAnalytics,
  CompetitiveIntelligence,
  StrategicPlanning,
  ExecutiveAlerts
} from '../contexts/ExecutiveAnalyticsContext';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_REPORTING_SERVICE_URL || 'http://localhost:8084';
const API_TIMEOUT = 10000;

// API Response Types
interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Service Class
class ExecutiveAnalyticsService {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Add authentication token to headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      ...this.defaultHeaders,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  // Generic API call method
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  // KPI Management
  async getKPIs(): Promise<ExecutiveKPI[]> {
    const response = await this.apiCall<ExecutiveKPI[]>('/api/executive/kpis');
    return response.data;
  }

  async updateKPI(kpiId: string, updates: Partial<ExecutiveKPI>): Promise<ExecutiveKPI> {
    const response = await this.apiCall<ExecutiveKPI>(`/api/executive/kpis/${kpiId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async getKPIHistory(kpiId: string, timeRange: string = '30d'): Promise<Array<{
    timestamp: string;
    value: number;
    target: number;
    change: number;
  }>> {
    const response = await this.apiCall<Array<{
      timestamp: string;
      value: number;
      target: number;
      change: number;
    }>>(`/api/executive/kpis/${kpiId}/history?range=${timeRange}`);
    return response.data;
  }

  // Predictive Analytics
  async getPredictiveAnalytics(timeframe: '6m' | '12m' | '24m' = '12m'): Promise<PredictiveAnalytics> {
    const response = await this.apiCall<PredictiveAnalytics>(`/api/executive/predictive?timeframe=${timeframe}`);
    return response.data;
  }

  async generateForecast(
    kpiId: string,
    scenarios: string[] = ['optimistic', 'realistic', 'pessimistic']
  ): Promise<{
    forecasts: Array<{
      scenario: string;
      predictions: Array<{
        period: string;
        value: number;
        confidence: number;
      }>;
    }>;
    assumptions: string[];
    methodology: string;
  }> {
    const response = await this.apiCall<{
      forecasts: Array<{
        scenario: string;
        predictions: Array<{
          period: string;
          value: number;
          confidence: number;
        }>;
      }>;
      assumptions: string[];
      methodology: string;
    }>('/api/executive/forecast', {
      method: 'POST',
      body: JSON.stringify({ kpiId, scenarios }),
    });
    return response.data;
  }

  // Competitive Intelligence
  async getCompetitiveIntelligence(): Promise<CompetitiveIntelligence> {
    const response = await this.apiCall<CompetitiveIntelligence>('/api/executive/competitive-intelligence');
    return response.data;
  }

  async getMarketAnalysis(): Promise<{
    marketSize: number;
    growthRate: number;
    trends: Array<{
      trend: string;
      impact: 'high' | 'medium' | 'low';
      timeframe: string;
    }>;
    opportunities: Array<{
      opportunity: string;
      marketSize: number;
      difficulty: 'high' | 'medium' | 'low';
      timeToMarket: string;
    }>;
  }> {
    const response = await this.apiCall<{
      marketSize: number;
      growthRate: number;
      trends: Array<{
        trend: string;
        impact: 'high' | 'medium' | 'low';
        timeframe: string;
      }>;
      opportunities: Array<{
        opportunity: string;
        marketSize: number;
        difficulty: 'high' | 'medium' | 'low';
        timeToMarket: string;
      }>;
    }>('/api/executive/market-analysis');
    return response.data;
  }

  // Strategic Planning
  async getStrategicPlanning(): Promise<StrategicPlanning> {
    const response = await this.apiCall<StrategicPlanning>('/api/executive/strategic-planning');
    return response.data;
  }

  async updateInitiative(
    initiativeId: string,
    updates: Partial<StrategicPlanning['initiatives'][0]>
  ): Promise<StrategicPlanning['initiatives'][0]> {
    const response = await this.apiCall<StrategicPlanning['initiatives'][0]>(
      `/api/executive/initiatives/${initiativeId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    );
    return response.data;
  }

  async runScenarioAnalysis(scenarios: Array<{
    name: string;
    assumptions: string[];
    parameters: Record<string, number>;
  }>): Promise<Array<{
    scenario: string;
    outcomes: {
      revenue: number;
      profitability: number;
      marketShare: number;
      riskLevel: number;
    };
    confidence: number;
    recommendations: string[];
  }>> {
    const response = await this.apiCall<Array<{
      scenario: string;
      outcomes: {
        revenue: number;
        profitability: number;
        marketShare: number;
        riskLevel: number;
      };
      confidence: number;
      recommendations: string[];
    }>>('/api/executive/scenario-analysis', {
      method: 'POST',
      body: JSON.stringify({ scenarios }),
    });
    return response.data;
  }

  // Carbon Credit Analytics
  async getCarbonCreditAnalytics(): Promise<{
    current: {
      credits: number;
      revenue: number;
      price: number;
    };
    forecast: {
      nextQuarter: number;
      nextYear: number;
      confidence: number;
    };
    optimization: {
      recommendations: Array<{
        action: string;
        expectedIncrease: number;
        investment: number;
        roi: number;
      }>;
      maxPotential: number;
    };
    market: {
      trend: 'bullish' | 'bearish' | 'stable';
      volatility: number;
      priceHistory: Array<{
        date: string;
        price: number;
      }>;
    };
  }> {
    const response = await this.apiCall<{
      current: {
        credits: number;
        revenue: number;
        price: number;
      };
      forecast: {
        nextQuarter: number;
        nextYear: number;
        confidence: number;
      };
      optimization: {
        recommendations: Array<{
          action: string;
          expectedIncrease: number;
          investment: number;
          roi: number;
        }>;
        maxPotential: number;
      };
      market: {
        trend: 'bullish' | 'bearish' | 'stable';
        volatility: number;
        priceHistory: Array<{
          date: string;
          price: number;
        }>;
      };
    }>('/api/executive/carbon-analytics');
    return response.data;
  }

  // Executive Alerts
  async getAlerts(
    category?: string,
    priority?: number,
    limit: number = 10
  ): Promise<PaginatedResponse<ExecutiveAlerts>> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (priority) params.append('priority', priority.toString());
    params.append('limit', limit.toString());

    const response = await this.apiCall<ExecutiveAlerts[]>(`/api/executive/alerts?${params}`);
    return response as PaginatedResponse<ExecutiveAlerts>;
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    await this.apiCall(`/api/executive/alerts/${alertId}/acknowledge`, {
      method: 'PATCH',
    });
  }

  async createAlert(alert: Omit<ExecutiveAlerts, 'id' | 'timestamp'>): Promise<ExecutiveAlerts> {
    const response = await this.apiCall<ExecutiveAlerts>('/api/executive/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    });
    return response.data;
  }

  // Voice Analytics
  async processVoiceQuery(
    transcript: string,
    language: 'en' | 'hi',
    context?: Record<string, any>
  ): Promise<{
    intent: string;
    entities: Record<string, any>;
    response: string;
    confidence: number;
    suggestions: string[];
    data?: any;
  }> {
    const response = await this.apiCall<{
      intent: string;
      entities: Record<string, any>;
      response: string;
      confidence: number;
      suggestions: string[];
      data?: any;
    }>('/api/executive/voice/process', {
      method: 'POST',
      body: JSON.stringify({ transcript, language, context }),
    });
    return response.data;
  }

  async getVoiceAnalytics(timeRange: string = '7d'): Promise<{
    totalQueries: number;
    avgConfidence: number;
    topIntents: Array<{
      intent: string;
      count: number;
      avgConfidence: number;
    }>;
    languageDistribution: {
      en: number;
      hi: number;
    };
    successRate: number;
    trends: Array<{
      date: string;
      queries: number;
      successRate: number;
    }>;
  }> {
    const response = await this.apiCall<{
      totalQueries: number;
      avgConfidence: number;
      topIntents: Array<{
        intent: string;
        count: number;
        avgConfidence: number;
      }>;
      languageDistribution: {
        en: number;
        hi: number;
      };
      successRate: number;
      trends: Array<{
        date: string;
        queries: number;
        successRate: number;
      }>;
    }>(`/api/executive/voice/analytics?range=${timeRange}`);
    return response.data;
  }

  // Export and Reporting
  async exportReport(
    reportType: 'executive-summary' | 'kpi-analysis' | 'strategic-planning' | 'competitive-intelligence',
    format: 'pdf' | 'excel' | 'csv',
    options?: {
      dateRange?: {
        start: string;
        end: string;
      };
      includeCharts?: boolean;
      includeRecommendations?: boolean;
    }
  ): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/api/executive/export/${reportType}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ format, options }),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Real-time data streaming
  createEventSource(endpoint: string): EventSource {
    const token = localStorage.getItem('authToken');
    const url = `${this.baseURL}${endpoint}${token ? `?token=${token}` : ''}`;
    return new EventSource(url);
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, 'up' | 'down'>;
    latency: number;
    timestamp: string;
  }> {
    const startTime = Date.now();
    const response = await this.apiCall<{
      status: 'healthy' | 'degraded' | 'unhealthy';
      services: Record<string, 'up' | 'down'>;
      timestamp: string;
    }>('/api/health');

    return {
      ...response.data,
      latency: Date.now() - startTime
    };
  }
}

// Create singleton instance
const executiveAnalyticsService = new ExecutiveAnalyticsService();

export default executiveAnalyticsService;

// Named exports for specific use cases
export {
  ExecutiveAnalyticsService,
  type APIResponse,
  type PaginatedResponse
};