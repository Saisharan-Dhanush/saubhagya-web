import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  FileText,
  Eye,
  Download
} from 'lucide-react';
import biogasService, { ProductionBatch, CreateBatchRequest, CompleteBatchRequest } from '../../services/biogasService';

// Mock types for BatchManagement (will be replaced with backend types)
type BatchStatus = 'processing' | 'ready' | 'transferred' | 'rejected' | 'testing' | 'SCHEDULED' | 'IN_PRODUCTION' | 'COMPLETED' | 'QUALITY_TESTED' | 'READY_FOR_SALE';

interface BatchData {
  id: string;
  digesterId: string;
  volume: number;
  methaneContent: number;
  status: BatchStatus;
  createdDate: string;
  transferDate?: string;
  qualityScore?: number;
  notes: string;
  farmerName?: string;
  source?: string;
}

interface QualityCertificate {
  id: string;
  batchId: string;
  issuedDate: string;
  qualityScore: number;
  certifiedBy?: string;
  validUntil?: string;
}

// Enhanced Mock data with realistic Indian biogas operations
const batches: BatchData[] = [
  {
    id: 'BATCH-001',
    digesterId: 'DIG-001',
    volume: 45.2,
    methaneContent: 65.8,
    status: 'ready',
    createdDate: new Date().toISOString(),
    transferDate: new Date(Date.now() + 7200000).toISOString(),
    qualityScore: 92,
    farmerName: 'राजेश कुमार',
    source: 'Gokul Gaushala, Mathura',
    notes: 'Premium quality cow dung batch from Rajesh Kumar. Optimal fermentation achieved with excellent gas composition. Ready for immediate transfer to distribution network. Source: 15 indigenous cows, organic feed only.'
  },
  {
    id: 'BATCH-002',
    digesterId: 'DIG-002',
    volume: 38.7,
    methaneContent: 62.3,
    status: 'processing',
    createdDate: new Date(Date.now() - 86400000).toISOString(),
    qualityScore: 78,
    farmerName: 'सुनीता देवी',
    source: 'Vrindavan Organic Farm',
    notes: 'Mixed dung batch in active fermentation phase. Temperature maintained at 37°C. Expected completion in 48 hours with good quality prospects. Contains cow and buffalo dung mixture from certified organic farm.'
  },
  {
    id: 'BATCH-003',
    digesterId: 'DIG-003',
    volume: 52.8,
    methaneContent: 68.2,
    status: 'ready',
    createdDate: new Date(Date.now() - 172800000).toISOString(),
    transferDate: new Date().toISOString(),
    qualityScore: 95,
    farmerName: 'श्याम यादव',
    source: 'Yamuna Riverside Gaushala',
    notes: 'Exceptional buffalo dung batch from Shyam Yadav. Highest methane content achieved this quarter. Certified Grade A premium quality. Source: 25 Murrah buffaloes with optimal nutrition and care.'
  },
  {
    id: 'BATCH-004',
    digesterId: 'DIG-001',
    volume: 41.3,
    methaneContent: 58.9,
    status: 'testing',
    createdDate: new Date(Date.now() - 259200000).toISOString(),
    qualityScore: 72,
    farmerName: 'अमित शर्मा',
    source: 'Govind Dairy Farm',
    notes: 'Standard cow dung batch undergoing final quality assessment. Moderate methane levels detected. Awaiting lab confirmation for Grade B classification. Processing time extended due to lower initial moisture content.'
  },
  {
    id: 'BATCH-005',
    digesterId: 'DIG-004',
    volume: 29.6,
    methaneContent: 55.4,
    status: 'rejected',
    createdDate: new Date(Date.now() - 345600000).toISOString(),
    qualityScore: 48,
    farmerName: 'प्रेम सिंह',
    source: 'Village Cooperative',
    notes: 'Batch from contaminated feedstock. Low methane content due to improper storage conditions. Rejected for commercial use, diverted to compost production. Root cause: contamination from non-organic sources and poor collection hygiene.'
  },
  {
    id: 'BATCH-006',
    digesterId: 'DIG-002',
    volume: 47.9,
    methaneContent: 63.7,
    status: 'transferred',
    createdDate: new Date(Date.now() - 432000000).toISOString(),
    transferDate: new Date(Date.now() - 86400000).toISOString(),
    qualityScore: 86,
    farmerName: 'गीता देवी',
    source: 'Krishna Valley Farm',
    notes: 'High-quality mixed dung batch successfully transferred to Mathura distribution center. Excellent fermentation results with consistent gas output. Customer feedback: exceptional performance in commercial biogas units.'
  },
  {
    id: 'BATCH-007',
    digesterId: 'DIG-003',
    volume: 35.1,
    methaneContent: 71.2,
    status: 'ready',
    createdDate: new Date(Date.now() - 518400000).toISOString(),
    qualityScore: 97,
    farmerName: 'राम प्रसाद',
    source: 'Organic Gaushala Trust',
    notes: 'Premium buffalo dung batch with exceptional methane purity. Sourced from Organic Gaushala cooperative. Meets all export quality standards. Tested for international markets - approved for European biogas facilities.'
  },
  {
    id: 'BATCH-008',
    digesterId: 'DIG-005',
    volume: 33.4,
    methaneContent: 59.8,
    status: 'processing',
    createdDate: new Date(Date.now() - 604800000).toISOString(),
    qualityScore: 74,
    farmerName: 'लक्ष्मी यादव',
    source: 'Braj Bhumi Gaushala',
    notes: 'Cow dung batch from Gita Devi\'s farm. Processing delayed due to monsoon humidity. Temperature regulation implemented, expecting improvement. Additional heating systems deployed to counter seasonal moisture challenges.'
  },
  {
    id: 'BATCH-009',
    digesterId: 'DIG-001',
    volume: 44.7,
    methaneContent: 66.4,
    status: 'testing',
    createdDate: new Date(Date.now() - 691200000).toISOString(),
    qualityScore: 88,
    farmerName: 'विकास कुमार',
    source: 'Vrindavan Heritage Gaushala',
    notes: 'Large volume cow dung batch from Vrindavan Gaushala. Final quality checks in progress. Preliminary results show excellent commercial viability. Volume sufficient for pilot testing in urban biogas distribution network.'
  },
  {
    id: 'BATCH-010',
    digesterId: 'DIG-004',
    volume: 39.8,
    methaneContent: 64.1,
    status: 'transferred',
    createdDate: new Date(Date.now() - 777600000).toISOString(),
    transferDate: new Date(Date.now() - 259200000).toISOString(),
    qualityScore: 83,
    farmerName: 'सुरेश चंद्र',
    source: 'Radha Krishna Dairy',
    notes: 'Standard quality mixed dung batch successfully delivered to regional distribution network. Good consistency maintained throughout fermentation cycle. Successfully integrated into 5 commercial biogas plants in the region.'
  }
];

const certificates: QualityCertificate[] = [
  {
    id: 'CERT-001',
    batchId: 'BATCH-001',
    issuedDate: new Date().toISOString(),
    qualityScore: 92,
    certifiedBy: 'Dr. Ravi Sharma, Quality Assurance',
    validUntil: new Date(Date.now() + 15552000000).toISOString() // 6 months validity
  },
  {
    id: 'CERT-002',
    batchId: 'BATCH-003',
    issuedDate: new Date(Date.now() - 86400000).toISOString(),
    qualityScore: 95,
    certifiedBy: 'Dr. Priya Gupta, Chief Quality Officer',
    validUntil: new Date(Date.now() + 15465600000).toISOString()
  },
  {
    id: 'CERT-003',
    batchId: 'BATCH-006',
    issuedDate: new Date(Date.now() - 172800000).toISOString(),
    qualityScore: 86,
    certifiedBy: 'Dr. Anil Kumar, Senior Analyst',
    validUntil: new Date(Date.now() + 15379200000).toISOString()
  },
  {
    id: 'CERT-004',
    batchId: 'BATCH-007',
    issuedDate: new Date(Date.now() - 259200000).toISOString(),
    qualityScore: 97,
    certifiedBy: 'Dr. Sunita Singh, Export Certification',
    validUntil: new Date(Date.now() + 15292800000).toISOString()
  },
  {
    id: 'CERT-005',
    batchId: 'BATCH-009',
    issuedDate: new Date(Date.now() - 345600000).toISOString(),
    qualityScore: 88,
    certifiedBy: 'Dr. Manoj Verma, Quality Assurance',
    validUntil: new Date(Date.now() + 15206400000).toISOString()
  },
  {
    id: 'CERT-006',
    batchId: 'BATCH-010',
    issuedDate: new Date(Date.now() - 432000000).toISOString(),
    qualityScore: 83,
    certifiedBy: 'Dr. Deepak Mishra, Regional Quality Head',
    validUntil: new Date(Date.now() + 15120000000).toISOString()
  }
];

// Mock functions
const createBatch = async (data: Partial<BatchData>) => {
  console.log('Creating batch:', data);
  return Promise.resolve();
};

const updateBatch = async (id: string, data: Partial<BatchData>) => {
  console.log('Updating batch:', id, data);
  return Promise.resolve();
};

const deleteBatch = async (id: string) => {
  console.log('Deleting batch:', id);
  return Promise.resolve();
};

interface BatchManagementProps {
  languageContext?: {
    language: 'hi' | 'en';
    t: (key: string) => string;
  };
}

const translations = {
  en: {
    title: 'Batch Management',
    subtitle: 'Manage biogas batches from production to transfer',
    createBatch: 'Create New Batch',
    editBatch: 'Edit Batch',
    deleteBatch: 'Delete Batch',
    batchList: 'Batch List',
    activeQualities: 'Active Quality Tests',
    certificates: 'Quality Certificates',
    search: 'Search batches...',
    filter: 'Filter',
    batchId: 'Batch ID',
    digesterId: 'Digester ID',
    volume: 'Volume (m³)',
    methaneContent: 'Methane Content (%)',
    status: 'Status',
    createdDate: 'Created Date',
    transferDate: 'Transfer Date',
    qualityScore: 'Quality Score',
    notes: 'Notes',
    actions: 'Actions',
    create: 'Create',
    update: 'Update',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    processing: 'Processing',
    ready: 'Ready',
    transferred: 'Transferred',
    rejected: 'Rejected',
    testing: 'Testing',
    viewDetails: 'View Details',
    downloadCert: 'Download Certificate',
    transferBatch: 'Transfer Batch',
    qualityTest: 'Quality Test',
    batchDetails: 'Batch Details',
    transferHistory: 'Transfer History',
    qualityReports: 'Quality Reports',
    farmerName: 'Farmer Name',
    source: 'Source',
    certifiedBy: 'Certified By',
    validUntil: 'Valid Until'
  },
  hi: {
    title: 'बैच प्रबंधन',
    subtitle: 'उत्पादन से स्थानांतरण तक बायोगैस बैचों का प्रबंधन',
    createBatch: 'नया बैच बनाएं',
    editBatch: 'बैच संपादित करें',
    deleteBatch: 'बैच हटाएं',
    batchList: 'बैच सूची',
    activeQualities: 'सक्रिय गुणवत्ता परीक्षण',
    certificates: 'गुणवत्ता प्रमाणपत्र',
    search: 'बैच खोजें...',
    filter: 'फिल्टर',
    batchId: 'बैच आईडी',
    digesterId: 'डाइजेस्टर आईडी',
    volume: 'आयतन (m³)',
    methaneContent: 'मीथेन सामग्री (%)',
    status: 'स्थिति',
    createdDate: 'निर्मित दिनांक',
    transferDate: 'स्थानांतरण दिनांक',
    qualityScore: 'गुणवत्ता स्कोर',
    notes: 'टिप्पणियां',
    actions: 'कार्य',
    create: 'बनाएं',
    update: 'अपडेट करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    confirm: 'पुष्टि करें',
    processing: 'प्रसंस्करण',
    ready: 'तैयार',
    transferred: 'स्थानांतरित',
    rejected: 'अस्वीकृत',
    testing: 'परीक्षण',
    viewDetails: 'विवरण देखें',
    downloadCert: 'प्रमाणपत्र डाउनलोड करें',
    transferBatch: 'बैच स्थानांतरित करें',
    qualityTest: 'गुणवत्ता परीक्षण',
    batchDetails: 'बैच विवरण',
    transferHistory: 'स्थानांतरण इतिहास',
    qualityReports: 'गुणवत्ता रिपोर्ट',
    farmerName: 'किसान का नाम',
    source: 'स्रोत',
    certifiedBy: 'प्रमाणित करने वाला',
    validUntil: 'तक वैध'
  }
};

const getStatusColor = (status: BatchStatus): string => {
  switch (status) {
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'ready':
      return 'bg-green-100 text-green-800';
    case 'transferred':
      return 'bg-gray-100 text-gray-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'testing':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: BatchStatus) => {
  switch (status) {
    case 'processing':
    case 'IN_PRODUCTION':
      return <Clock className="w-4 h-4" />;
    case 'ready':
    case 'READY_FOR_SALE':
      return <CheckCircle className="w-4 h-4" />;
    case 'transferred':
    case 'COMPLETED':
      return <Truck className="w-4 h-4" />;
    case 'rejected':
      return <AlertCircle className="w-4 h-4" />;
    case 'testing':
    case 'QUALITY_TESTED':
      return <Package className="w-4 h-4" />;
    case 'SCHEDULED':
      return <Clock className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

// Helper function to map backend batch status to frontend
const mapBackendStatusToFrontend = (backendStatus: string): BatchStatus => {
  switch (backendStatus) {
    case 'SCHEDULED':
      return 'testing';
    case 'IN_PRODUCTION':
      return 'processing';
    case 'COMPLETED':
      return 'transferred';
    case 'QUALITY_TESTED':
      return 'testing';
    case 'READY_FOR_SALE':
      return 'ready';
    default:
      return 'processing';
  }
};

// Helper function to calculate quality score from batch data
const calculateQualityScore = (batch: ProductionBatch): number => {
  if (!batch.methaneContentPercent) return 0;

  // Simple quality calculation based on methane content and efficiency
  const methaneScore = (batch.methaneContentPercent / 70) * 60; // Max 60 points
  const efficiencyScore = ((batch.productionEfficiencyPercent || 0) / 100) * 40; // Max 40 points

  return Math.min(100, Math.round(methaneScore + efficiencyScore));
};

const BatchForm: React.FC<{
  batch?: BatchData;
  onSubmit: (data: Partial<BatchData>) => void;
  onCancel: () => void;
  t: (key: string) => string;
}> = ({ batch, onSubmit, onCancel, t }) => {
  const [formData, setFormData] = useState({
    digesterId: batch?.digesterId || '',
    volume: batch?.volume?.toString() || '',
    methaneContent: batch?.methaneContent?.toString() || '',
    notes: batch?.notes || '',
    farmerName: batch?.farmerName || '',
    source: batch?.source || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      volume: parseFloat(formData.volume),
      methaneContent: parseFloat(formData.methaneContent)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="digesterId">{t('digesterId')}</Label>
        <Select value={formData.digesterId} onValueChange={(value) => setFormData(prev => ({ ...prev, digesterId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select digester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DIG-001">Digester 001 - Main Unit</SelectItem>
            <SelectItem value="DIG-002">Digester 002 - Secondary Unit</SelectItem>
            <SelectItem value="DIG-003">Digester 003 - Buffalo Unit</SelectItem>
            <SelectItem value="DIG-004">Digester 004 - Mixed Feed</SelectItem>
            <SelectItem value="DIG-005">Digester 005 - Experimental</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="farmerName">{t('farmerName')}</Label>
          <Input
            id="farmerName"
            value={formData.farmerName}
            onChange={(e) => setFormData(prev => ({ ...prev, farmerName: e.target.value }))}
            placeholder="राजेश कुमार"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">{t('source')}</Label>
          <Input
            id="source"
            value={formData.source}
            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            placeholder="Gokul Gaushala, Mathura"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="volume">{t('volume')}</Label>
          <Input
            id="volume"
            type="number"
            step="0.1"
            value={formData.volume}
            onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
            placeholder="0.0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="methaneContent">{t('methaneContent')}</Label>
          <Input
            id="methaneContent"
            type="number"
            step="0.1"
            value={formData.methaneContent}
            onChange={(e) => setFormData(prev => ({ ...prev, methaneContent: e.target.value }))}
            placeholder="0.0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('notes')}</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Detailed batch information including source details, quality parameters, and special notes..."
          rows={4}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit">
          {batch ? t('update') : t('create')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export const BatchManagement: React.FC<BatchManagementProps> = ({ languageContext }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BatchStatus | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchData | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<BatchData | null>(null);

  // Backend integration state
  const [backendBatches, setBackendBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clusterId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'; // From seed data

  const lang = languageContext?.language || 'en';
  const t = (key: string): string => {
    return languageContext?.t(key) || translations[lang][key as keyof typeof translations[typeof lang]] || key;
  };

  // Fetch batches from backend
  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        const response = await biogasService.getBatches(clusterId, undefined, 0, 50);
        if (response.success && response.data) {
          setBackendBatches(response.data.content);
          setError(null);
        } else {
          console.error('Failed to fetch batches:', response.error);
          setError(response.error || 'Failed to fetch batches');
        }
      } catch (err) {
        console.error('Error fetching batches:', err);
        setError('Network error while fetching batches');
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [clusterId]);

  // Map backend batches to frontend format
  const mappedBatches: BatchData[] = backendBatches.map(batch => ({
    id: batch.batchNumber,
    digesterId: `DIG-${batch.id}`,
    volume: batch.biogasProducedCubicMeters || 0,
    methaneContent: batch.methaneContentPercent || 0,
    status: mapBackendStatusToFrontend(batch.batchStatus),
    createdDate: batch.productionStartDate,
    transferDate: batch.productionEndDate,
    qualityScore: calculateQualityScore(batch),
    farmerName: 'Farmer', // TODO: Get from contributions
    source: `Cluster ${batch.clusterId}`,
    notes: batch.notes || ''
  }));

  // Use mapped batches or fallback to mock data
  const batchesToDisplay = backendBatches.length > 0 ? mappedBatches : batches;

  const filteredBatches = batchesToDisplay.filter(batch => {
    const matchesSearch = batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.digesterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.source?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBatch = async (data: Partial<BatchData>) => {
    try {
      const request: CreateBatchRequest = {
        clusterId: clusterId,
        sourceContributions: [], // TODO: Add contribution IDs
        totalInputWeightKg: data.volume || 0,
        productionStartDate: new Date().toISOString(),
        notes: data.notes
      };

      const response = await biogasService.createBatch(request);
      if (response.success) {
        setIsCreateDialogOpen(false);
        // Refresh batches
        const refreshResponse = await biogasService.getBatches(clusterId);
        if (refreshResponse.success && refreshResponse.data) {
          setBackendBatches(refreshResponse.data.content);
        }
      } else {
        setError(response.error || 'Failed to create batch');
      }
    } catch (err) {
      console.error('Error creating batch:', err);
      setError('Network error while creating batch');
    }
  };

  const handleUpdateBatch = async (data: Partial<BatchData>) => {
    if (editingBatch) {
      // TODO: Implement update batch API
      console.log('Update batch:', editingBatch.id, data);
      setEditingBatch(null);
    }
  };

  const handleDeleteBatch = async () => {
    if (deletingBatch) {
      // TODO: Implement delete batch API
      console.log('Delete batch:', deletingBatch.id);
      setDeletingBatch(null);
    }
  };

  const activeBatches = batchesToDisplay.filter(b => b.status === 'processing' || b.status === 'testing' || b.status === 'IN_PRODUCTION');
  const readyBatches = batchesToDisplay.filter(b => b.status === 'ready' || b.status === 'READY_FOR_SALE');
  const transferredBatches = batchesToDisplay.filter(b => b.status === 'transferred' || b.status === 'COMPLETED');
  const totalVolume = batchesToDisplay.reduce((sum, b) => sum + b.volume, 0);
  const averageQuality = batchesToDisplay.filter(b => b.qualityScore).reduce((sum, b) => sum + (b.qualityScore || 0), 0) / batchesToDisplay.filter(b => b.qualityScore).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between -mt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t('createBatch')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{t('createBatch')}</DialogTitle>
              <DialogDescription>
                Create a new biogas batch from digester output with detailed source information
              </DialogDescription>
            </DialogHeader>
            <BatchForm
              onSubmit={handleCreateBatch}
              onCancel={() => setIsCreateDialogOpen(false)}
              t={t}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBatches.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Transfer</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyBatches.length}</div>
            <p className="text-xs text-muted-foreground">
              Quality approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVolume.toFixed(1)} m³</div>
            <p className="text-xs text-muted-foreground">
              All batches combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Quality</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageQuality.toFixed(1)}/100</div>
            <p className="text-xs text-muted-foreground">
              Quality score average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for download
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="batches" className="space-y-6">
        <TabsList>
          <TabsTrigger value="batches">{t('batchList')}</TabsTrigger>
          <TabsTrigger value="quality">{t('activeQualities')}</TabsTrigger>
          <TabsTrigger value="certificates">{t('certificates')}</TabsTrigger>
        </TabsList>

        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('batchList')}</CardTitle>
                  <CardDescription>
                    Manage all biogas batches and their lifecycle with detailed source tracking
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t('search')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BatchStatus | 'all')}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="transferred">Transferred</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('batchId')}</TableHead>
                    <TableHead>{t('farmerName')}</TableHead>
                    <TableHead>{t('source')}</TableHead>
                    <TableHead>{t('volume')}</TableHead>
                    <TableHead>{t('methaneContent')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('qualityScore')}</TableHead>
                    <TableHead>{t('createdDate')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell>{batch.farmerName || 'N/A'}</TableCell>
                      <TableCell className="max-w-32 truncate" title={batch.source}>
                        {batch.source || 'N/A'}
                      </TableCell>
                      <TableCell>{batch.volume.toFixed(1)} m³</TableCell>
                      <TableCell>{batch.methaneContent.toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(batch.status)}
                            {t(batch.status)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {batch.qualityScore ? (
                          <span className={`font-medium ${
                            batch.qualityScore >= 90 ? 'text-green-600' :
                            batch.qualityScore >= 70 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {batch.qualityScore}/100
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(batch.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBatch(batch)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletingBatch(batch)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            title={batch.notes}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>{t('activeQualities')}</CardTitle>
              <CardDescription>
                Monitor ongoing quality testing processes with detailed progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batches.filter(b => b.status === 'testing').map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{batch.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        Farmer: {batch.farmerName} | Volume: {batch.volume.toFixed(1)} m³
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Source: {batch.source}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(batch.status)}>
                        {t('testing')}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Progress
                      </Button>
                    </div>
                  </div>
                ))}
                {batches.filter(b => b.status === 'testing').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2" />
                    <p>No active quality tests</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>{t('certificates')}</CardTitle>
              <CardDescription>
                Download and manage quality certificates with detailed certification information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates.map((cert) => {
                  const batch = batches.find(b => b.id === cert.batchId);
                  return (
                    <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{cert.batchId}</h4>
                        <p className="text-sm text-muted-foreground">
                          Farmer: {batch?.farmerName} | Score: {cert.qualityScore}/100
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Certified by: {cert.certifiedBy}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Issued: {new Date(cert.issuedDate).toLocaleDateString()} |
                          Valid until: {cert.validUntil ? new Date(cert.validUntil).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-800">
                          Certified
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {certificates.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2" />
                    <p>No certificates available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingBatch} onOpenChange={() => setEditingBatch(null)}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{t('editBatch')}</DialogTitle>
            <DialogDescription>
              Update batch information and status with detailed source tracking
            </DialogDescription>
          </DialogHeader>
          {editingBatch && (
            <BatchForm
              batch={editingBatch}
              onSubmit={handleUpdateBatch}
              onCancel={() => setEditingBatch(null)}
              t={t}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingBatch} onOpenChange={() => setDeletingBatch(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteBatch')}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete batch {deletingBatch?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingBatch(null)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteBatch}>
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BatchManagement;