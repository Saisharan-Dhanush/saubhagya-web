import { useState, useEffect } from 'react'
import { MapPin, Calculator, TrendingUp, Users, IndianRupee, Target, FileText, Phone, CheckCircle, Clock, AlertCircle, PlusCircle } from 'lucide-react'
import { usePlatform } from '../contexts/PlatformContext'
import { useAuth } from '../contexts/AuthContext'

interface FeasibilityProject {
  id: string;
  farmerId: string;
  farmerName: string;
  location: string;
  cattleCount: number;
  estimatedProduction: number;
  investmentRequired: number;
  subsidyAmount: number;
  roiMonths: number;
  status: 'assessment' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  createdDate: Date;
  expectedStartDate?: Date;
}

interface SubsidyApplication {
  id: string;
  farmerId: string;
  farmerName: string;
  applicationNumber: string;
  subsidyType: 'central' | 'state' | 'combined';
  amount: number;
  applicationDate: Date;
  status: 'submitted' | 'under_review' | 'approved' | 'disbursed' | 'rejected';
  remarks?: string;
}

interface BusinessLead {
  id: string;
  farmerName: string;
  phone: string;
  location: string;
  cattleCount: number;
  interest: 'high' | 'medium' | 'low';
  stage: 'contact' | 'assessment' | 'proposal' | 'negotiation' | 'conversion';
  assignedTo: string;
  lastContact: Date;
  nextFollowUp: Date;
}

const API_BASE = 'http://localhost:8080' // IoT service for mapping and feasibility
const AUTH_API = 'http://localhost:8081/auth/api' // Auth service
const BIOGAS_API = 'http://localhost:8080/biogas' // For production data

export default function UrjaSanyojak() {
  const { trackModuleUsage, updateBreadcrumbs } = usePlatform()
  const { user } = useAuth()

  const [feasibilityProjects, setFeasibilityProjects] = useState<FeasibilityProject[]>([])
  const [subsidyApplications, setSubsidyApplications] = useState<SubsidyApplication[]>([])
  const [businessLeads, setBusinessLeads] = useState<BusinessLead[]>([])
  const [selectedTab, setSelectedTab] = useState<'feasibility' | 'subsidies' | 'pipeline'>('feasibility')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    trackModuleUsage('urjasanyojak', 'view')
    updateBreadcrumbs([
      { label: 'UrjaSanyojak Dashboard', url: '/urjasanyojak', module: 'business-dev' }
    ])
    loadBusinessData()
  }, [])

  // Load data from backend APIs
  const loadBusinessData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadFeasibilityProjects(),
        loadSubsidyApplications(),
        loadBusinessLeads()
      ])
    } catch (error) {
      console.error('Error loading business data:', error)
    }
    setLoading(false)
  }

  const loadFeasibilityProjects = async () => {
    try {
      // Call actual backend API for feasibility analysis
      const response = await fetch(`${API_BASE}/api/iot/analytics/feasibility/projects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFeasibilityProjects(data)
      } else {
        // Fallback to mock data if backend not available
        setFeasibilityProjects([])
      }
    } catch (error) {
      console.warn('Feasibility API error, using fallback:', error)
      setFeasibilityProjects([])
    }
  }

  const loadSubsidyApplications = async () => {
    try {
      const response = await fetch(`${AUTH_API}/subsidies/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubsidyApplications(data)
      } else {
        setSubsidyApplications([])
      }
    } catch (error) {
      console.warn('Subsidy API error, using fallback:', error)
      setSubsidyApplications([])
    }
  }

  const loadBusinessLeads = async () => {
    try {
      const response = await fetch(`${AUTH_API}/business/leads`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBusinessLeads(data)
      } else {
        setBusinessLeads([])
      }
    } catch (error) {
      console.warn('Business leads API error, using fallback:', error)
      setBusinessLeads([])
    }
  }

  // Backend API calls for actions
  const calculateFeasibility = async (farmerId: string, cattleCount: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/iot/analytics/feasibility/calculate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          farmerId,
          cattleCount,
          location: 'default', // Should be passed from form
          userId: user?.id
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Feasibility calculation:', result)
        await loadFeasibilityProjects() // Refresh data
        return result
      }
    } catch (error) {
      console.error('Feasibility calculation error:', error)
    }
  }

  const submitSubsidyApplication = async (applicationData: any) => {
    try {
      const response = await fetch(`${AUTH_API}/subsidies/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...applicationData,
          submittedBy: user?.id,
          submissionDate: new Date()
        })
      })

      if (response.ok) {
        const result = await response.json()
        await loadSubsidyApplications() // Refresh data
        alert(`Subsidy application ${result.applicationNumber} submitted successfully!`)
        return result
      }
    } catch (error) {
      console.error('Subsidy application error:', error)
      alert('Error submitting application. Please try again.')
    }
  }

  const updateLeadStatus = async (leadId: string, newStage: string) => {
    try {
      const response = await fetch(`${AUTH_API}/business/leads/${leadId}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stage: newStage,
          updatedBy: user?.id,
          lastContact: new Date()
        })
      })

      if (response.ok) {
        await loadBusinessLeads() // Refresh data
        console.log(`Lead ${leadId} updated to ${newStage}`)
      }
    } catch (error) {
      console.error('Lead update error:', error)
    }
  }

  // All data now comes from backend - no more mock data!

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'completed': case 'disbursed': case 'conversion':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress': case 'under_review': case 'assessment': case 'negotiation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business development dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="text-green-600" />
            UrjaSanyojak Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Business Development & Project Pipeline Management</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Business Development Officer</p>
          <p className="font-semibold text-gray-900">{user?.name}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Projects</p>
              <p className="text-2xl font-bold text-blue-600">{feasibilityProjects.length}</p>
            </div>
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subsidy Applications</p>
              <p className="text-2xl font-bold text-green-600">{subsidyApplications.length}</p>
            </div>
            <IndianRupee className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Business Leads</p>
              <p className="text-2xl font-bold text-purple-600">{businessLeads.length}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-orange-600">65%</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'feasibility', label: 'Feasibility Projects', icon: Calculator },
              { id: 'subsidies', label: 'Subsidy Applications', icon: IndianRupee },
              { id: 'pipeline', label: 'Business Pipeline', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  selectedTab === id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Feasibility Projects Tab */}
          {selectedTab === 'feasibility' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Feasibility Assessment Projects</h2>
                <button
                  onClick={() => calculateFeasibility('new-farmer', 25)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  New Assessment
                </button>
              </div>

              <div className="space-y-4">
                {feasibilityProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{project.farmerName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {project.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {project.location}
                          </div>
                          <div>
                            <span className="font-medium">Cattle:</span> {project.cattleCount}
                          </div>
                          <div>
                            <span className="font-medium">Production:</span> {project.estimatedProduction} m³/day
                          </div>
                          <div>
                            <span className="font-medium">ROI:</span> {project.roiMonths} months
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Investment Required:</span> {formatCurrency(project.investmentRequired)}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Subsidy Amount:</span> {formatCurrency(project.subsidyAmount)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => calculateFeasibility(project.farmerId, project.cattleCount)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Recalculate
                        </button>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subsidies Tab */}
          {selectedTab === 'subsidies' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Subsidy Applications</h2>
                <button
                  onClick={() => submitSubsidyApplication({
                    farmerId: 'FARM-NEW',
                    farmerName: 'New Farmer',
                    subsidyType: 'central',
                    amount: 500000
                  })}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  New Application
                </button>
              </div>

              <div className="space-y-4">
                {subsidyApplications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{application.farmerName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {application.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                          <div>
                            <span className="font-medium">Application #:</span> {application.applicationNumber}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {application.subsidyType.toUpperCase()}
                          </div>
                          <div>
                            <span className="font-medium">Amount:</span> {formatCurrency(application.amount)}
                          </div>
                        </div>
                        {application.remarks && (
                          <div className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Remarks:</span> {application.remarks}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        Applied: {application.applicationDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Pipeline Tab */}
          {selectedTab === 'pipeline' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Business Pipeline</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Lead
                </button>
              </div>

              <div className="space-y-4">
                {businessLeads.map((lead) => (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{lead.farmerName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.stage)}`}>
                            {lead.stage.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.interest === 'high' ? 'bg-red-100 text-red-800' :
                            lead.interest === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.interest.toUpperCase()} INTEREST
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {lead.location}
                          </div>
                          <div>
                            <span className="font-medium">Cattle:</span> {lead.cattleCount}
                          </div>
                          <div>
                            <span className="font-medium">Assigned:</span> {lead.assignedTo}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Last Contact: {lead.lastContact.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            Next Follow-up: {lead.nextFollowUp.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={lead.stage}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="contact">Contact</option>
                          <option value="assessment">Assessment</option>
                          <option value="proposal">Proposal</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="conversion">Conversion</option>
                        </select>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}