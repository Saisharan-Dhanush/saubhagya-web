/**
 * View Cattle Page - Enhanced with shadcn UI components
 * Beautiful, modern interface for viewing cattle details
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Edit,
  Trash2,
  User,
  Home,
  Ruler,
  Baby,
  Globe,
  Settings,
  Activity,
  Scan,
  Heart,
  Utensils,
  Milk,
  MapPin,
  Phone,
  Shield,
  Syringe,
  ClipboardList,
  Camera,
  AlertCircle
} from 'lucide-react';
import {
  cattleApi,
  masterDataApi,
  calculateAgeFromDob,
  type Cattle,
  type Breed,
  type Species,
  type Gender,
  type Color,
  type Location
} from '../../services/gaushala/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function ViewCattle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<Cattle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Master data for lookups
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  /**
   * Helper functions to get master data names by ID
   */
  const getBreedName = (breedId: number): string => {
    const breed = breeds.find(b => b.id === breedId);
    return breed?.name || `Breed #${breedId}`;
  };

  const getSpeciesName = (speciesId: number): string => {
    const sp = species.find(s => s.id === speciesId);
    return sp?.name || `Species #${speciesId}`;
  };

  const getGenderName = (genderId: number): string => {
    const gender = genders.find(g => g.id === genderId);
    return gender?.name || `Gender #${genderId}`;
  };

  const getColorName = (colorId: number): string => {
    const color = colors.find(c => c.id === colorId);
    return color?.name || `Color #${colorId}`;
  };

  const getGaushalaName = (gaushalaId: number): string => {
    const location = locations.find(l => l.id === gaushalaId);
    return location?.name || `Gaushala #${gaushalaId}`;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Load master data and cattle record in parallel
        const [breedsRes, speciesRes, gendersRes, colorsRes, locationsRes, cattleRes] = await Promise.all([
          masterDataApi.getAllBreeds(),
          masterDataApi.getAllSpecies(),
          masterDataApi.getAllGenders(),
          masterDataApi.getAllColors(),
          masterDataApi.getAllLocations(),
          cattleApi.getCattleById(parseInt(id))
        ]);

        if (breedsRes.success && breedsRes.data) setBreeds(breedsRes.data);
        if (speciesRes.success && speciesRes.data) setSpecies(speciesRes.data);
        if (gendersRes.success && gendersRes.data) setGenders(gendersRes.data);
        if (colorsRes.success && colorsRes.data) setColors(colorsRes.data);
        if (locationsRes.success && locationsRes.data) setLocations(locationsRes.data);

        if (cattleRes.success && cattleRes.data) {
          setRecord(cattleRes.data);
        } else {
          setError(cattleRes.error || 'Cattle record not found');
        }
      } catch (error) {
        console.error('Error fetching cattle record:', error);
        setError('Failed to load cattle details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/gaushala/cattle/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this cattle record?')) {
      return;
    }

    try {
      const result = await cattleApi.deleteCattle(parseInt(id));

      if (result.success) {
        navigate('/gaushala/cattle');
      } else {
        alert(result.error || 'Failed to delete cattle record');
      }
    } catch (error) {
      console.error('Error deleting cattle record:', error);
      alert('Failed to delete cattle record');
    }
  };

  const handleBack = () => {
    navigate('/gaushala/cattle');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <div>
                <CardTitle>Cattle Not Found</CardTitle>
                <CardDescription className="text-destructive">
                  {error || 'The requested cattle record could not be found.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cattle List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const DetailField = ({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) => (
    <div className="space-y-2.5">
      <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
        {icon && <span className="text-blue-600 dark:text-blue-400">{icon}</span>}
        <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">{label}</span>
      </div>
      <div className="text-base font-bold tracking-tight font-smooth text-foreground pl-1">{value || <span className="text-muted-foreground">-</span>}</div>
    </div>
  );

  const isFemale = genders.find(g => g.name.toLowerCase() === 'female' && g.id === record.genderId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Avatar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-lg ring-2 ring-primary/10">
            <img
              src={record.photoUrl || '/images/Cow Default Profile.webp'}
              alt={record.name || record.uniqueAnimalId}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tighter font-smooth text-foreground">{record.name || 'Unnamed Cattle'}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="font-mono text-sm font-medium tracking-tight border-primary/20 text-primary">
                {record.uniqueAnimalId}
              </Badge>
              <Badge variant={record.isActive ? 'default' : 'secondary'} className="font-medium">
                {record.isActive ? '● Active' : '○ Inactive'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleEdit} size="lg">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleDelete} variant="destructive" size="lg">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={handleBack} variant="outline" size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/10 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Age</p>
                <p className="text-3xl font-extrabold tracking-tight font-smooth text-blue-700 dark:text-blue-300 mt-1">
                  {calculateAgeFromDob(record.dob)} <span className="text-lg text-muted-foreground font-medium">yrs</span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 tracking-wider uppercase">Weight</p>
                <p className="text-3xl font-extrabold tracking-tight font-smooth text-green-700 dark:text-green-300 mt-1">
                  {record.weight ? <>{record.weight} <span className="text-lg text-muted-foreground font-medium">kg</span></> : '-'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Ruler className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {isFemale && record.milkYieldPerDay && (
          <Card className="border-primary/10 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 tracking-wider uppercase">Milk Yield</p>
                  <p className="text-3xl font-extrabold tracking-tight font-smooth text-purple-700 dark:text-purple-300 mt-1">
                    {record.milkYieldPerDay} <span className="text-lg text-muted-foreground font-medium">L/day</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Milk className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-primary/10 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-background">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 tracking-wider uppercase">Health Status</p>
                <Badge
                  variant={record.healthStatus?.toLowerCase() === 'healthy' ? 'default' : 'secondary'}
                  className="mt-2 text-base font-semibold px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                >
                  {record.healthStatus || 'Unknown'}
                </Badge>
              </div>
              <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Heart className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="font-semibold">
            <User className="h-4 w-4 mr-2" />
            <span className="font-smooth">Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="physical" className="font-semibold">
            <Ruler className="h-4 w-4 mr-2" />
            <span className="font-smooth">Physical</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="font-semibold">
            <Heart className="h-4 w-4 mr-2" />
            <span className="font-smooth">Health</span>
          </TabsTrigger>
          {isFemale && (
            <TabsTrigger value="reproduction" className="font-semibold">
              <Baby className="h-4 w-4 mr-2" />
              <span className="font-smooth">Reproduction</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="other" className="font-semibold">
            <FileText className="h-4 w-4 mr-2" />
            <span className="font-smooth">Other</span>
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                Basic Identification
              </CardTitle>
              <CardDescription className="text-muted-foreground">Core identification details of the cattle</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Unique Animal ID" value={record.uniqueAnimalId} icon={<Scan className="h-4 w-4" />} />
              <DetailField label="Name" value={record.name || '-'} icon={<User className="h-4 w-4" />} />
              <DetailField label="Breed" value={getBreedName(record.breedId)} icon={<FileText className="h-4 w-4" />} />
              <DetailField label="Species" value={getSpeciesName(record.speciesId)} icon={<FileText className="h-4 w-4" />} />
              <DetailField label="Gender" value={getGenderName(record.genderId)} icon={<User className="h-4 w-4" />} />
              <DetailField label="Color" value={getColorName(record.colorId)} icon={<FileText className="h-4 w-4" />} />
              <DetailField label="Date of Birth" value={formatDate(record.dob)} icon={<Calendar className="h-4 w-4" />} />
              <DetailField label="Age" value={`${calculateAgeFromDob(record.dob)} years`} icon={<Calendar className="h-4 w-4" />} />
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-emerald-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                Gaushala Assignment
              </CardTitle>
              <CardDescription className="text-muted-foreground">Current location and housing details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Assigned Gaushala" value={getGaushalaName(record.gaushalaId)} icon={<Home className="h-4 w-4" />} />
              <DetailField label="Shed Number" value={record.shedNumber || '-'} icon={<Home className="h-4 w-4" />} />
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                  <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">Status</span>
                </div>
                <Badge variant={record.isActive ? 'default' : 'secondary'} className="text-base ml-1">
                  {record.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-amber-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                Origin & Ownership
              </CardTitle>
              <CardDescription className="text-muted-foreground">Acquisition and ownership information</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Source of Acquisition" value={record.sourceId ? `Source #${record.sourceId}` : '-'} icon={<Globe className="h-4 w-4" />} />
              <DetailField label="Date of Acquisition" value={formatDate(record.dateOfAcquisition)} icon={<Calendar className="h-4 w-4" />} />
              <DetailField label="Previous Owner" value={record.previousOwner || '-'} icon={<User className="h-4 w-4" />} />
              <DetailField label="Ownership Status" value={record.ownershipId ? `Ownership #${record.ownershipId}` : '-'} icon={<FileText className="h-4 w-4" />} />
              <DetailField label="Date of Entry" value={formatDate(record.dateOfEntry)} icon={<Calendar className="h-4 w-4" />} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Physical Characteristics Tab */}
        <TabsContent value="physical" className="space-y-4">
          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-violet-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Ruler className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                Physical Measurements
              </CardTitle>
              <CardDescription className="text-muted-foreground">Size and physical attributes</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Weight" value={record.weight ? `${record.weight} kg` : '-'} icon={<Ruler className="h-4 w-4" />} />
              <DetailField label="Height" value={record.height ? `${record.height} cm` : '-'} icon={<Ruler className="h-4 w-4" />} />
              <DetailField label="Horn Status" value={record.hornStatus || '-'} icon={<FileText className="h-4 w-4" />} />
              <DetailField label="Color" value={getColorName(record.colorId)} icon={<FileText className="h-4 w-4" />} />
              {record.disability && (
                <DetailField label="Disability" value={record.disability} icon={<AlertCircle className="h-4 w-4" />} />
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-cyan-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Scan className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                Identification Tags
              </CardTitle>
              <CardDescription className="text-muted-foreground">Electronic and physical identification systems</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                  <Scan className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">RFID Tag Number</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-base font-bold bg-secondary p-3 rounded-lg tracking-tight text-foreground">
                  {record.rfidTagNo || <span className="text-muted-foreground">-</span>}
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">Ear Tag Number</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-base font-bold bg-secondary p-3 rounded-lg tracking-tight text-foreground">
                  {record.earTagNo || <span className="text-muted-foreground">-</span>}
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                  <Scan className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">Microchip Number</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-base font-bold bg-secondary p-3 rounded-lg tracking-tight text-foreground">
                  {record.microchipNo || <span className="text-muted-foreground">-</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {record.photoUrl && (
            <Card className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader className="bg-gradient-to-r from-pink-500/5 to-transparent">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Camera className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  Cattle Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={record.photoUrl}
                  alt="Cattle Photo"
                  className="w-full max-w-2xl h-auto object-cover rounded-lg border shadow-sm"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Health & Medical Tab */}
        <TabsContent value="health" className="space-y-4">
          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-emerald-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                Vaccination & Prevention
              </CardTitle>
              <CardDescription className="text-muted-foreground">Vaccination and preventive care records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                    <Syringe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">Vaccination Status</span>
                  </div>
                  <Badge variant="outline" className="text-base font-semibold px-3 py-1 border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300 ml-1">
                    {record.vaccinationStatus || 'Not Recorded'}
                  </Badge>
                </div>
                <DetailField label="Deworming Schedule" value={record.dewormingSchedule || '-'} icon={<ClipboardList className="h-4 w-4" />} />
                <DetailField label="Last Health Checkup" value={formatDate(record.lastHealthCheckupDate)} icon={<Calendar className="h-4 w-4" />} />
              </div>
              {record.medicalHistory && (
                <>
                  <Separator />
                  <div className="space-y-2.5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                      <ClipboardList className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">Medical History</span>
                    </div>
                    <p className="text-base leading-relaxed bg-secondary p-4 rounded-lg font-smooth text-foreground">{record.medicalHistory}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-sky-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                </div>
                Veterinarian Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">Assigned veterinarian contact details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailField label="Veterinarian Name" value={record.vetName || '-'} icon={<User className="h-4 w-4" />} />
              <DetailField label="Veterinarian Contact" value={record.vetContact || '-'} icon={<Phone className="h-4 w-4" />} />
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-rose-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                Current Health Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant={record.healthStatus?.toLowerCase() === 'healthy' ? 'default' : 'destructive'} className="text-lg px-4 py-2 font-bold">
                  {record.healthStatus || 'Unknown'}
                </Badge>
              </div>
              {record.disability && (
                <>
                  <Separator />
                  <div className="space-y-2.5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">Disability Notes</span>
                    </div>
                    <p className="text-base leading-relaxed bg-secondary p-4 rounded-lg font-smooth text-foreground">{record.disability}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reproduction Tab (only for female cattle) */}
        {isFemale && (
          <TabsContent value="reproduction" className="space-y-4">
            <Card className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader className="bg-gradient-to-r from-pink-500/5 to-transparent">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  Reproductive Details
                </CardTitle>
                <CardDescription className="text-muted-foreground">Pregnancy and breeding information</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                    <Baby className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">Pregnancy Status</span>
                  </div>
                  <Badge variant="outline" className="text-base font-semibold border-pink-200 text-pink-700 dark:border-pink-800 dark:text-pink-300 ml-1">
                    {record.pregnancyStatus || 'Unknown'}
                  </Badge>
                </div>
                <DetailField label="Last Calving Date" value={formatDate(record.lastCalvingDate)} icon={<Calendar className="h-4 w-4" />} />
                <DetailField label="Number of Calves" value={record.calvesCount || '-'} icon={<Baby className="h-4 w-4" />} />
              </CardContent>
            </Card>

            <Card className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader className="bg-gradient-to-r from-purple-500/5 to-transparent">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Milk className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Milk Production
                </CardTitle>
                <CardDescription className="text-muted-foreground">Lactation and milk yield information</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                    <Milk className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">Milking Status</span>
                  </div>
                  <Badge variant="outline" className="text-base font-semibold border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300 ml-1">
                    {record.milkingStatus || 'Unknown'}
                  </Badge>
                </div>
                <DetailField label="Milk Yield Per Day" value={record.milkYieldPerDay ? `${record.milkYieldPerDay} L` : '-'} icon={<Milk className="h-4 w-4" />} />
                <DetailField label="Lactation Number" value={record.lactationNumber || '-'} icon={<FileText className="h-4 w-4" />} />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Other Information Tab */}
        <TabsContent value="other" className="space-y-4">
          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-orange-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Utensils className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                Feeding Details
              </CardTitle>
              <CardDescription className="text-muted-foreground">Diet and feeding schedule information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailField label="Feed Type" value={record.feedTypeId ? `Feed Type #${record.feedTypeId}` : '-'} icon={<Utensils className="h-4 w-4" />} />
              {record.feedingSchedule && (
                <>
                  <Separator />
                  <div className="space-y-2.5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-r">
                      <ClipboardList className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-100 tracking-wide uppercase">Feeding Schedule</span>
                    </div>
                    <p className="text-base leading-relaxed bg-secondary p-4 rounded-lg font-smooth text-foreground">{record.feedingSchedule}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-teal-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                Dung Collection Statistics
              </CardTitle>
              <CardDescription className="text-muted-foreground">Biogas production related metrics</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailField
                label="Total Dung Collected"
                value={record.totalDungCollected ? `${record.totalDungCollected} kg` : '-'}
                icon={<Activity className="h-4 w-4" />}
              />
              <DetailField
                label="Last Dung Collection"
                value={record.lastDungCollection ? `${record.lastDungCollection} kg` : '-'}
                icon={<Activity className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-gradient-to-r from-slate-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="h-8 w-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                Record Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">System audit and timestamp details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {record.id && <DetailField label="Record ID" value={record.id} icon={<FileText className="h-4 w-4" />} />}
              {record.createdAt && (
                <DetailField label="Record Created" value={formatDateTime(record.createdAt)} icon={<Calendar className="h-4 w-4" />} />
              )}
              {record.updatedAt && (
                <DetailField label="Last Updated" value={formatDateTime(record.updatedAt)} icon={<Calendar className="h-4 w-4" />} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
