import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  stage: string;
  capacity: number; // m³/day
  investment: number; // in rupees
  estimatedDuration: number; // in months
  priority: 'low' | 'medium' | 'high';
  assignedTeam: string[];
  startDate: string;
  expectedCompletionDate: string;
  progress: number; // percentage
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  stakeholders: string[];
}

const projectStages = [
  'Lead Generation',
  'Feasibility Study',
  'Financial Modeling',
  'Approvals & Permits',
  'Construction',
  'Commissioning'
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Goverdhan Dairy Plant',
    location: 'Goverdhan, UP',
    stage: 'Lead Generation',
    capacity: 2000,
    investment: 75000000,
    estimatedDuration: 18,
    priority: 'high',
    assignedTeam: ['Raj Kumar', 'Priya Singh'],
    startDate: '2024-09-01',
    expectedCompletionDate: '2026-03-01',
    progress: 15,
    riskLevel: 'low',
    description: 'Large-scale biogas plant for Goverdhan dairy cooperative',
    stakeholders: ['Goverdhan Dairy Cooperative', 'UP Government', 'Local Farmers']
  },
  {
    id: '2',
    name: 'Barsana Community Plant',
    location: 'Barsana, UP',
    stage: 'Feasibility Study',
    capacity: 1200,
    investment: 50000000,
    estimatedDuration: 15,
    priority: 'medium',
    assignedTeam: ['Amit Sharma', 'Sita Devi'],
    startDate: '2024-08-15',
    expectedCompletionDate: '2025-11-15',
    progress: 35,
    riskLevel: 'medium',
    description: 'Community-owned biogas plant for rural energy access',
    stakeholders: ['Barsana Panchayat', 'Rural Development Ministry', 'Local NGO']
  },
  {
    id: '3',
    name: 'Radha Kund Eco Plant',
    location: 'Radha Kund, UP',
    stage: 'Financial Modeling',
    capacity: 800,
    investment: 35000000,
    estimatedDuration: 12,
    priority: 'medium',
    assignedTeam: ['Vinod Kumar'],
    startDate: '2024-07-01',
    expectedCompletionDate: '2025-07-01',
    progress: 55,
    riskLevel: 'low',
    description: 'Eco-friendly biogas plant with carbon credit focus',
    stakeholders: ['Eco Trust Foundation', 'Carbon Credit Agency', 'Local Gaushala']
  },
  {
    id: '4',
    name: 'Vrindavan Heritage Plant',
    location: 'Vrindavan, UP',
    stage: 'Approvals & Permits',
    capacity: 1500,
    investment: 60000000,
    estimatedDuration: 20,
    priority: 'high',
    assignedTeam: ['Meera Joshi', 'Krishna Das'],
    startDate: '2024-06-01',
    expectedCompletionDate: '2026-02-01',
    progress: 70,
    riskLevel: 'medium',
    description: 'Heritage-compliant biogas plant near Vrindavan temples',
    stakeholders: ['Vrindavan Temple Committee', 'Archaeological Survey', 'Tourism Board']
  },
  {
    id: '5',
    name: 'Gokul Farmers Collective',
    location: 'Gokul, UP',
    stage: 'Construction',
    capacity: 1000,
    investment: 40000000,
    estimatedDuration: 14,
    priority: 'high',
    assignedTeam: ['Ramesh Yadav', 'Sunita Kumari', 'Tech Team'],
    startDate: '2024-03-01',
    expectedCompletionDate: '2025-05-01',
    progress: 85,
    riskLevel: 'low',
    description: 'Farmers collective biogas plant with cooperative model',
    stakeholders: ['Gokul Farmers Collective', 'Cooperative Bank', 'Agriculture Department']
  },
  {
    id: '6',
    name: 'Mathura Industrial Plant',
    location: 'Mathura, UP',
    stage: 'Commissioning',
    capacity: 2500,
    investment: 90000000,
    estimatedDuration: 24,
    priority: 'high',
    assignedTeam: ['Technical Team', 'Operations Team'],
    startDate: '2023-12-01',
    expectedCompletionDate: '2025-12-01',
    progress: 95,
    riskLevel: 'low',
    description: 'Large industrial biogas plant for Mathura region',
    stakeholders: ['Mathura Industrial Association', 'State Government', 'Energy Board']
  }
];

export default function PipelineManagementPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || project.stage === stageFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;

    return matchesSearch && matchesStage && matchesPriority;
  });

  const getProjectsByStage = (stage: string) => {
    return filteredProjects.filter(project => project.stage === stage);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'Lead Generation': 'bg-blue-100 text-blue-800',
      'Feasibility Study': 'bg-purple-100 text-purple-800',
      'Financial Modeling': 'bg-orange-100 text-orange-800',
      'Approvals & Permits': 'bg-yellow-100 text-yellow-800',
      'Construction': 'bg-green-100 text-green-800',
      'Commissioning': 'bg-emerald-100 text-emerald-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow mb-3">
      <CardContent className="pt-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h5 className="font-medium text-sm">{project.name}</h5>
              <p className="text-xs text-muted-foreground flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {project.location}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Badge className={getPriorityColor(project.priority)} variant="outline">
                {project.priority}
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity:</span>
              <span className="font-medium">{project.capacity} m³/day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Investment:</span>
              <span className="font-medium">₹{(project.investment / 10000000).toFixed(1)}Cr</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Team & Timeline */}
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Team:</span>
              <span className="font-medium">{project.assignedTeam.length} members</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{project.estimatedDuration} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk:</span>
              <span className={`font-medium ${getRiskColor(project.riskLevel)}`}>
                {project.riskLevel}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-7"
              onClick={() => setSelectedProject(project)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs h-7">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProjectKanban = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {projectStages.map(stage => {
        const stageProjects = getProjectsByStage(stage);
        return (
          <Card key={stage} className="min-h-96">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm">{stage}</h4>
                <Badge variant="outline" className="text-xs">
                  {stageProjects.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {stageProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Calculate pipeline metrics
  const totalProjects = projects.length;
  const totalInvestment = projects.reduce((sum, project) => sum + project.investment, 0);
  const averageProgress = projects.reduce((sum, project) => sum + project.progress, 0) / projects.length;
  const highPriorityProjects = projects.filter(p => p.priority === 'high').length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Pipeline Management</h1>
          <p className="text-gray-600 mt-1">Track and manage biogas plant development projects</p>
        </div>
        <Button size="lg" onClick={() => setShowNewProjectModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </Button>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
                <p className="text-xs text-green-600">Active pipeline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Investment</p>
                <p className="text-2xl font-bold">₹{(totalInvestment / 10000000).toFixed(0)}Cr</p>
                <p className="text-xs text-gray-500">Pipeline value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold">{averageProgress.toFixed(0)}%</p>
                <p className="text-xs text-blue-600">Overall completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">{highPriorityProjects}</p>
                <p className="text-xs text-red-600">Critical projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {projectStages.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <ProjectKanban />

      {/* Project Details Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedProject.name}</span>
                <Badge className={getStageColor(selectedProject.stage)}>
                  {selectedProject.stage}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span>{selectedProject.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span>{selectedProject.capacity} m³/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span>₹{(selectedProject.investment / 10000000).toFixed(1)} Crores</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{selectedProject.estimatedDuration} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge className={getPriorityColor(selectedProject.priority)}>
                        {selectedProject.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedProject.description}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Team & Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Assigned Team:</span>
                      <div className="mt-1">
                        {selectedProject.assignedTeam.map(member => (
                          <Badge key={member} variant="outline" className="mr-1 mb-1">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span>{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Completion:</span>
                      <span>{new Date(selectedProject.expectedCompletionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Stakeholders</h4>
                  <div className="space-y-1">
                    {selectedProject.stakeholders.map(stakeholder => (
                      <div key={stakeholder} className="text-sm text-gray-600">
                        • {stakeholder}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* New Project Modal */}
      <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <Alert>
            <Plus className="h-4 w-4" />
            <AlertDescription>
              New project creation form will be implemented here.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    </div>
  );
}