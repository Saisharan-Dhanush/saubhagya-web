/**
 * GauShala Management System - Field Worker Dashboard
 * Comprehensive cattle management, dung collection tracking, and transaction history
 * Uses BaseLayout for consistent UI architecture
 */

import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, Home, Receipt, History, Heart } from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import BaseLayout, { NavigationItem, BreadcrumbItem } from '@/components/layout/BaseLayout';
import GauShalaHome from './gaushala/GauShalaHome';
import CattleManagement from './gaushala/CattleManagement';
import AddCattle from './gaushala/AddCattle';
import CattleDetail from './gaushala/CattleDetail';
import AllTransactions from './gaushala/AllTransactions';
import FoodHistory from './gaushala/FoodHistory';
import AddFoodHistory from './gaushala/AddFoodHistory';
import ViewFoodHistory from './gaushala/ViewFoodHistory';
import EditFoodHistory from './gaushala/EditFoodHistory';
import HealthHistory from './gaushala/HealthHistory';
import AddMedicine from './gaushala/AddMedicine';
import ViewCattle from './gaushala/ViewCattle';
import EditCattle from './gaushala/EditCattle';

// Language Context
interface LanguageContextType {
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    title: 'GauShala Management',
    subtitle: 'Comprehensive cattle and dung collection management',
    home: 'Dashboard',
    cattle: 'Cattle Management',
    addCattle: 'Add Cattle',
    cattleDetails: 'Cattle Details',
    transactions: 'Transaction History',
    allTransactions: 'All Field Worker Transactions',
    foodHistory: 'Food History',
    healthHistory: 'Health History',
    settings: 'Settings',
    hindi: 'हिंदी',
    english: 'English'
  },
  hi: {
    title: 'गौशाला प्रबंधन',
    subtitle: 'व्यापक पशु और गोबर संग्रह प्रबंधन',
    home: 'डैशबोर्ड',
    cattle: 'पशु प्रबंधन',
    addCattle: 'पशु जोड़ें',
    cattleDetails: 'पशु विवरण',
    transactions: 'लेन-देन का इतिहास',
    allTransactions: 'सभी फील्ड वर्कर लेन-देन',
    foodHistory: 'भोजन इतिहास',
    healthHistory: 'स्वास्थ्य इतिहास',
    settings: 'सेटिंग्स',
    hindi: 'हिंदी',
    english: 'English'
  }
};

export default function GauShala() {
  const navigate = useNavigate();
  const location = useLocation();
  const { platformSettings, updateBreadcrumbs } = usePlatform();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[platformSettings.language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const languageContext: LanguageContextType = {
    language: platformSettings.language,
    setLanguage: () => {}, // This will be handled by the global platform context
    t
  };

  // Get current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/cattle/add')) return 'addCattle';
    if (path.includes('/cattle/edit/')) return 'editCattle';
    if (path.includes('/cattle/view/')) return 'viewCattle';
    if (path.includes('/cattle/') && path.split('/').length > 3) return 'cattleDetails';
    if (path.includes('/cattle')) return 'cattle';
    if (path.includes('/all-transactions')) return 'allTransactions';
    if (path.includes('/food-history/add')) return 'addFoodHistory';
    if (path.includes('/food-history/edit/')) return 'editFoodHistory';
    if (path.includes('/food-history/view/')) return 'viewFoodHistory';
    if (path.includes('/food-history')) return 'foodHistory';
    if (path.includes('/health-history/add')) return 'addMedicine';
    if (path.includes('/health-history')) return 'healthHistory';
    return 'home';
  };

  const setActiveTab = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/gaushala');
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('home'), url: '/gaushala', module: 'gaushala' }
        ]);
        break;
      case 'cattle':
        navigate('/gaushala/cattle');
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('cattle'), url: '/gaushala/cattle', module: 'gaushala' }
        ]);
        break;
      case 'allTransactions':
        navigate('/gaushala/all-transactions');
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('allTransactions'), url: '/gaushala/all-transactions', module: 'gaushala' }
        ]);
        break;
      case 'foodHistory':
        navigate('/gaushala/food-history');
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('foodHistory'), url: '/gaushala/food-history', module: 'gaushala' }
        ]);
        break;
      case 'healthHistory':
        navigate('/gaushala/health-history');
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('healthHistory'), url: '/gaushala/health-history', module: 'gaushala' }
        ]);
        break;
    }
  };

  const activeTab = getCurrentTab();

  // Generate breadcrumbs based on current route
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const currentTab = getCurrentTab();
    switch (currentTab) {
      case 'home':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Dashboard' }
        ];
      case 'cattle':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Cattle Management' }
        ];
      case 'addCattle':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Cattle Management', onClick: () => navigate('/gaushala/cattle') },
          { label: 'Add Cattle' }
        ];
      case 'viewCattle':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Cattle Management', onClick: () => navigate('/gaushala/cattle') },
          { label: 'View Cattle' }
        ];
      case 'editCattle':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Cattle Management', onClick: () => navigate('/gaushala/cattle') },
          { label: 'Edit Cattle' }
        ];
      case 'cattleDetails':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Cattle Management', onClick: () => navigate('/gaushala/cattle') },
          { label: 'Cattle Details' }
        ];
      case 'allTransactions':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Transaction History' }
        ];
      case 'foodHistory':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Food History' }
        ];
      case 'addFoodHistory':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Food History', onClick: () => navigate('/gaushala/food-history') },
          { label: 'Create Food History' }
        ];
      case 'viewFoodHistory':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Food History', onClick: () => navigate('/gaushala/food-history') },
          { label: 'View Details' }
        ];
      case 'editFoodHistory':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Food History', onClick: () => navigate('/gaushala/food-history') },
          { label: 'Edit Food History' }
        ];
      case 'healthHistory':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Health History' }
        ];
      case 'addMedicine':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Health History', onClick: () => navigate('/gaushala/health-history') },
          { label: 'Create Medicine' }
        ];
      default:
        return [{ label: 'Gausakhi' }];
    }
  };

  // Define navigation items for BaseLayout
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
      onClick: () => setActiveTab('home'),
      isActive: activeTab === 'home'
    },
    {
      id: 'cattle',
      label: 'Cattle Management',
      icon: <Users className="w-4 h-4" />,
      onClick: () => setActiveTab('cattle'),
      isActive: activeTab === 'cattle' || activeTab === 'addCattle' || activeTab === 'cattleDetails' || activeTab === 'viewCattle' || activeTab === 'editCattle'
    },
    {
      id: 'allTransactions',
      label: 'Transaction History',
      icon: <Receipt className="w-4 h-4" />,
      onClick: () => setActiveTab('allTransactions'),
      isActive: activeTab === 'allTransactions'
    },
    {
      id: 'foodHistory',
      label: 'Food History',
      icon: <History className="w-4 h-4" />,
      onClick: () => setActiveTab('foodHistory'),
      isActive: activeTab === 'foodHistory' || activeTab === 'addFoodHistory' || activeTab === 'viewFoodHistory' || activeTab === 'editFoodHistory'
    },
    {
      id: 'healthHistory',
      label: 'Health History',
      icon: <Heart className="w-4 h-4" />,
      onClick: () => setActiveTab('healthHistory'),
      isActive: activeTab === 'healthHistory' || activeTab === 'addMedicine'
    }
  ];

  // Update breadcrumbs when component loads or location changes
  useEffect(() => {
    const currentTab = getCurrentTab();
    switch (currentTab) {
      case 'home':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('home'), url: '/gaushala', module: 'gaushala' }
        ]);
        break;
      case 'cattle':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('cattle'), url: '/gaushala/cattle', module: 'gaushala' }
        ]);
        break;
      case 'addCattle':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('cattle'), url: '/gaushala/cattle', module: 'gaushala' },
          { label: t('addCattle'), url: '/gaushala/cattle/add', module: 'gaushala' }
        ]);
        break;
      case 'viewCattle':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('cattle'), url: '/gaushala/cattle', module: 'gaushala' },
          { label: 'View Cattle', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'editCattle':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('cattle'), url: '/gaushala/cattle', module: 'gaushala' },
          { label: 'Edit Cattle', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'cattleDetails':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('cattle'), url: '/gaushala/cattle', module: 'gaushala' },
          { label: t('cattleDetails'), url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'allTransactions':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('allTransactions'), url: '/gaushala/all-transactions', module: 'gaushala' }
        ]);
        break;
      case 'foodHistory':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('foodHistory'), url: '/gaushala/food-history', module: 'gaushala' }
        ]);
        break;
      case 'addFoodHistory':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('foodHistory'), url: '/gaushala/food-history', module: 'gaushala' },
          { label: 'Create Food History', url: '/gaushala/food-history/add', module: 'gaushala' }
        ]);
        break;
      case 'viewFoodHistory':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('foodHistory'), url: '/gaushala/food-history', module: 'gaushala' },
          { label: 'View Details', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'editFoodHistory':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('foodHistory'), url: '/gaushala/food-history', module: 'gaushala' },
          { label: 'Edit Food History', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'healthHistory':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('healthHistory'), url: '/gaushala/health-history', module: 'gaushala' }
        ]);
        break;
      case 'addMedicine':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('healthHistory'), url: '/gaushala/health-history', module: 'gaushala' },
          { label: 'Create Medicine', url: '/gaushala/health-history/add', module: 'gaushala' }
        ]);
        break;
    }
  }, [location.pathname, platformSettings.language]);

  return (
    <BaseLayout
      moduleName="Gausakhi"
      moduleSubtitle="Comprehensive cattle and dung collection management"
      navigationItems={navigationItems}
      breadcrumbs={getBreadcrumbs()}
      userInfo={{
        name: "Ramesh Kumar",
        role: "Field Worker",
      }}
    >
      <Routes>
        <Route path="/" element={<GauShalaHome languageContext={languageContext} />} />
        <Route path="/cattle" element={<CattleManagement languageContext={languageContext} />} />
        <Route path="/cattle/add" element={<AddCattle languageContext={languageContext} />} />
        <Route path="/cattle/view/:id" element={<ViewCattle />} />
        <Route path="/cattle/edit/:id" element={<EditCattle />} />
        <Route path="/cattle/:id" element={<CattleDetail languageContext={languageContext} />} />
        <Route path="/all-transactions" element={<AllTransactions />} />
        <Route path="/food-history" element={<FoodHistory />} />
        <Route path="/food-history/add" element={<AddFoodHistory />} />
        <Route path="/food-history/view/:id" element={<ViewFoodHistory />} />
        <Route path="/food-history/edit/:id" element={<EditFoodHistory />} />
        <Route path="/health-history" element={<HealthHistory />} />
        <Route path="/health-history/add" element={<AddMedicine />} />
      </Routes>
    </BaseLayout>
  );
}