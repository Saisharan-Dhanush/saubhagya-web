/**
 * GauShala Management System - Field Worker Dashboard
 * Comprehensive cattle management, dung collection tracking, and transaction history
 * Uses BaseLayout for consistent UI architecture
 */

import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, Home, Receipt } from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import BaseLayout, { NavigationItem, BreadcrumbItem } from '@/components/layout/BaseLayout';
import GauShalaHome from './gaushala/GauShalaHome';
import CattleManagement from './gaushala/CattleManagement';
import AddCattle from './gaushala/AddCattle';
import CattleDetail from './gaushala/CattleDetail';
import TransactionHistory from './gaushala/TransactionHistory';
import AllTransactions from './gaushala/AllTransactions';
import CreateDungTransaction from './gaushala/CreateDungTransaction';

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
    if (path.includes('/cattle/') && path.split('/').length > 3) return 'cattleDetails';
    if (path.includes('/cattle')) return 'cattle';
    if (path.includes('/all-transactions')) return 'allTransactions';
    if (path.includes('/transactions')) return 'transactions';
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
      case 'transactions':
        navigate('/gaushala/transactions');
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('transactions'), url: '/gaushala/transactions', module: 'gaushala' }
        ]);
        break;
      case 'allTransactions':
        navigate('/gaushala/all-transactions');
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('allTransactions'), url: '/gaushala/all-transactions', module: 'gaushala' }
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
      case 'cattleDetails':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Cattle Management', onClick: () => navigate('/gaushala/cattle') },
          { label: 'Cattle Details' }
        ];
      case 'transactions':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Transaction History' }
        ];
      case 'allTransactions':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Field Worker Transactions' }
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
      isActive: activeTab === 'cattle' || activeTab === 'addCattle' || activeTab === 'cattleDetails'
    },
    {
      id: 'transactions',
      label: 'Transaction History',
      icon: <Receipt className="w-4 h-4" />,
      onClick: () => setActiveTab('transactions'),
      isActive: activeTab === 'transactions'
    },
    {
      id: 'allTransactions',
      label: 'All Field Worker Transactions',
      icon: <Users className="w-4 h-4" />,
      onClick: () => setActiveTab('allTransactions'),
      isActive: activeTab === 'allTransactions'
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
      case 'cattleDetails':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('cattle'), url: '/gaushala/cattle', module: 'gaushala' },
          { label: t('cattleDetails'), url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'transactions':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('transactions'), url: '/gaushala/transactions', module: 'gaushala' }
        ]);
        break;
      case 'allTransactions':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('allTransactions'), url: '/gaushala/all-transactions', module: 'gaushala' }
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
        <Route path="/cattle/:id" element={<CattleDetail languageContext={languageContext} />} />
        <Route path="/transactions" element={<TransactionHistory languageContext={languageContext} />} />
        <Route path="/transactions/create" element={<CreateDungTransaction languageContext={languageContext} />} />
        <Route path="/all-transactions" element={<AllTransactions />} />
      </Routes>
    </BaseLayout>
  );
}