/**
 * GauShala Management System - Field Worker Dashboard
 * Comprehensive cattle management, dung collection tracking, and transaction history
 * Uses BaseLayout for consistent UI architecture
 */

import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, Home, Receipt, History, Heart, Package, Warehouse, Milk, Radio, Pill } from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import BaseLayout, { NavigationItem, BreadcrumbItem } from '@/components/layout/BaseLayout';
import GauShalaHome from './gaushala/GauShalaHome';
import CattleManagement from './gaushala/CattleManagement';
import AddCattle from './gaushala/AddCattle';
import AllTransactions from './gaushala/AllTransactions';
import FoodHistory from './gaushala/FoodHistory';
import AddFoodHistory from './gaushala/AddFoodHistory';
import ViewFoodHistory from './gaushala/ViewFoodHistory';
import EditFoodHistory from './gaushala/EditFoodHistory';
import HealthHistory from './gaushala/HealthHistory';
import AddHealthRecord from './gaushala/AddHealthRecord';
import AddMedicine from './gaushala/AddMedicine';
import ViewCattle from './gaushala/ViewCattle';
import EditCattle from './gaushala/EditCattle';
import ViewMedicine from './gaushala/ViewMedicine';
import EditMedicine from './gaushala/EditMedicine';
import MedicineList from './gaushala/MedicineList';
import ShedList from './gaushala/sheds/ShedList';
import AddShed from './gaushala/sheds/AddShed';
import EditShed from './gaushala/sheds/EditShed';
import ShedDetail from './gaushala/sheds/ShedDetail';
import ShedCapacityDashboard from './gaushala/sheds/ShedCapacityDashboard';
import InventoryList from './gaushala/inventory/InventoryList';
import AddInventory from './gaushala/inventory/AddInventory';
import EditInventory from './gaushala/inventory/EditInventory';
import InventoryStockHistory from './gaushala/inventory/InventoryStockHistory';
import MilkProductionList from './gaushala/production/MilkProductionList';
import RecordMilkProduction from './gaushala/production/RecordMilkProduction';
import MilkAnalytics from './gaushala/production/MilkAnalytics';
import RFIDScanHistory from './gaushala/rfid/RFIDScanHistory';
import RFIDAnalytics from './gaushala/rfid/RFIDAnalytics';

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
    if (path.includes('/cattle')) return 'cattle';
    if (path.includes('/all-transactions')) return 'allTransactions';
    if (path.includes('/food-history/add')) return 'addFoodHistory';
    if (path.includes('/food-history/edit/')) return 'editFoodHistory';
    if (path.includes('/food-history/view/')) return 'viewFoodHistory';
    if (path.includes('/food-history')) return 'foodHistory';
    if (path.includes('/medicine/add')) return 'addMedicine';
    if (path.includes('/medicine/edit/')) return 'editMedicine';
    if (path.includes('/medicine/view/')) return 'viewMedicine';
    if (path.includes('/medicine')) return 'medicineList';
    if (path.includes('/health-history/add')) return 'addHealthRecord';
    if (path.includes('/health-history/edit/')) return 'editHealthRecord';
    if (path.includes('/health-history/view/')) return 'viewHealthRecord';
    if (path.includes('/health-history')) return 'healthHistory';
    if (path.includes('/inventory/add')) return 'addInventory';
    if (path.includes('/inventory/edit/')) return 'editInventory';
    if (path.includes('/inventory') && path.includes('/stock-history')) return 'inventoryStockHistory';
    if (path.includes('/inventory')) return 'inventory';
    if (path.includes('/sheds/add')) return 'addShed';
    if (path.includes('/sheds/edit/')) return 'editShed';
    if (path.includes('/sheds/detail/')) return 'shedDetail';
    if (path.includes('/sheds/capacity')) return 'shedCapacity';
    if (path.includes('/sheds')) return 'sheds';
    if (path.includes('/production/record')) return 'recordProduction';
    if (path.includes('/production/analytics')) return 'productionAnalytics';
    if (path.includes('/production') || path.includes('/milk-production')) return 'production';
    if (path.includes('/rfid/analytics')) return 'rfidAnalytics';
    if (path.includes('/rfid/scans') || path.includes('/rfid-analytics')) return 'rfidScans';
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
          { label: 'Medicine Inventory', onClick: () => navigate('/gaushala/medicine') },
          { label: 'Add Medicine' }
        ];
      case 'addHealthRecord':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Health History', onClick: () => navigate('/gaushala/health-history') },
          { label: 'Add Health Record' }
        ];
      case 'editHealthRecord':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Health History', onClick: () => navigate('/gaushala/health-history') },
          { label: 'Edit Health Record' }
        ];
      case 'viewHealthRecord':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Health History', onClick: () => navigate('/gaushala/health-history') },
          { label: 'View Health Record' }
        ];
      case 'medicineList':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Medicine Inventory' }
        ];
      case 'viewMedicine':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Medicine Inventory', onClick: () => navigate('/gaushala/medicine') },
          { label: 'View Medicine' }
        ];
      case 'editMedicine':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Medicine Inventory', onClick: () => navigate('/gaushala/medicine') },
          { label: 'Edit Medicine' }
        ];
      case 'inventory':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Inventory' }
        ];
      case 'addInventory':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Inventory', onClick: () => navigate('/gaushala/inventory') },
          { label: 'Add Inventory' }
        ];
      case 'editInventory':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Inventory', onClick: () => navigate('/gaushala/inventory') },
          { label: 'Edit Inventory' }
        ];
      case 'inventoryStockHistory':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Inventory', onClick: () => navigate('/gaushala/inventory') },
          { label: 'Stock History' }
        ];
      case 'sheds':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Shed Management' }
        ];
      case 'addShed':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Shed Management', onClick: () => navigate('/gaushala/sheds') },
          { label: 'Add Shed' }
        ];
      case 'editShed':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Shed Management', onClick: () => navigate('/gaushala/sheds') },
          { label: 'Edit Shed' }
        ];
      case 'shedDetail':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Shed Management', onClick: () => navigate('/gaushala/sheds') },
          { label: 'Shed Details' }
        ];
      case 'shedCapacity':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Shed Management', onClick: () => navigate('/gaushala/sheds') },
          { label: 'Capacity Dashboard' }
        ];
      case 'production':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Milk Production' }
        ];
      case 'recordProduction':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Milk Production', onClick: () => navigate('/gaushala/production') },
          { label: 'Record Production' }
        ];
      case 'productionAnalytics':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'Milk Production', onClick: () => navigate('/gaushala/production') },
          { label: 'Analytics' }
        ];
      case 'rfidScans':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'RFID Analytics', onClick: () => navigate('/gaushala/rfid/scans') },
          { label: 'Scan History' }
        ];
      case 'rfidAnalytics':
        return [
          { label: 'Gausakhi', onClick: () => navigate('/gaushala') },
          { label: 'RFID Analytics' }
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
      isActive: activeTab === 'cattle' || activeTab === 'addCattle' || activeTab === 'viewCattle' || activeTab === 'editCattle'
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
      isActive: activeTab === 'healthHistory'
    },
    {
      id: 'medicine',
      label: 'Medicine Inventory',
      icon: <Pill className="w-4 h-4" />,
      onClick: () => navigate('/gaushala/medicine'),
      isActive: activeTab === 'medicineList' || activeTab === 'addMedicine' || activeTab === 'viewMedicine' || activeTab === 'editMedicine'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package className="w-4 h-4" />,
      onClick: () => navigate('/gaushala/inventory'),
      isActive: location.pathname.includes('/inventory')
    },
    {
      id: 'sheds',
      label: 'Shed Management',
      icon: <Warehouse className="w-4 h-4" />,
      onClick: () => navigate('/gaushala/sheds'),
      isActive: location.pathname.includes('/sheds')
    },
    {
      id: 'production',
      label: 'Milk Production',
      icon: <Milk className="w-4 h-4" />,
      onClick: () => navigate('/gaushala/production'),
      isActive: location.pathname.includes('/production')
    },
    {
      id: 'rfid',
      label: 'RFID Analytics',
      icon: <Radio className="w-4 h-4" />,
      onClick: () => navigate('/gaushala/rfid/scans'),
      isActive: location.pathname.includes('/rfid')
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
          { label: 'Medicine Inventory', url: '/gaushala/medicine', module: 'gaushala' },
          { label: 'Add Medicine', url: '/gaushala/medicine/add', module: 'gaushala' }
        ]);
        break;
      case 'addHealthRecord':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('healthHistory'), url: '/gaushala/health-history', module: 'gaushala' },
          { label: 'Add Health Record', url: '/gaushala/health-history/add', module: 'gaushala' }
        ]);
        break;
      case 'editHealthRecord':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('healthHistory'), url: '/gaushala/health-history', module: 'gaushala' },
          { label: 'Edit Health Record', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'viewHealthRecord':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: t('healthHistory'), url: '/gaushala/health-history', module: 'gaushala' },
          { label: 'View Health Record', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'medicineList':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Medicine Inventory', url: '/gaushala/medicine', module: 'gaushala' }
        ]);
        break;
      case 'viewMedicine':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Medicine Inventory', url: '/gaushala/medicine', module: 'gaushala' },
          { label: 'View Medicine', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'editMedicine':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Medicine Inventory', url: '/gaushala/medicine', module: 'gaushala' },
          { label: 'Edit Medicine', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'inventory':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Inventory', url: '/gaushala/inventory', module: 'gaushala' }
        ]);
        break;
      case 'addInventory':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Inventory', url: '/gaushala/inventory', module: 'gaushala' },
          { label: 'Add Inventory', url: '/gaushala/inventory/add', module: 'gaushala' }
        ]);
        break;
      case 'editInventory':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Inventory', url: '/gaushala/inventory', module: 'gaushala' },
          { label: 'Edit Inventory', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'inventoryStockHistory':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Inventory', url: '/gaushala/inventory', module: 'gaushala' },
          { label: 'Stock History', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'sheds':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Shed Management', url: '/gaushala/sheds', module: 'gaushala' }
        ]);
        break;
      case 'addShed':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Shed Management', url: '/gaushala/sheds', module: 'gaushala' },
          { label: 'Add Shed', url: '/gaushala/sheds/add', module: 'gaushala' }
        ]);
        break;
      case 'editShed':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Shed Management', url: '/gaushala/sheds', module: 'gaushala' },
          { label: 'Edit Shed', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'shedDetail':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Shed Management', url: '/gaushala/sheds', module: 'gaushala' },
          { label: 'Shed Details', url: location.pathname, module: 'gaushala' }
        ]);
        break;
      case 'shedCapacity':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Shed Management', url: '/gaushala/sheds', module: 'gaushala' },
          { label: 'Capacity Dashboard', url: '/gaushala/sheds/capacity', module: 'gaushala' }
        ]);
        break;
      case 'production':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Milk Production', url: '/gaushala/production', module: 'gaushala' }
        ]);
        break;
      case 'recordProduction':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Milk Production', url: '/gaushala/production', module: 'gaushala' },
          { label: 'Record Production', url: '/gaushala/production/record', module: 'gaushala' }
        ]);
        break;
      case 'productionAnalytics':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'Milk Production', url: '/gaushala/production', module: 'gaushala' },
          { label: 'Analytics', url: '/gaushala/production/analytics', module: 'gaushala' }
        ]);
        break;
      case 'rfidScans':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'RFID Analytics', url: '/gaushala/rfid/scans', module: 'gaushala' },
          { label: 'Scan History', url: '/gaushala/rfid/scans', module: 'gaushala' }
        ]);
        break;
      case 'rfidAnalytics':
        updateBreadcrumbs([
          { label: t('title'), url: '/gaushala', module: 'gaushala' },
          { label: 'RFID Analytics', url: '/gaushala/rfid/analytics', module: 'gaushala' }
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
        <Route path="/dashboard" element={<GauShalaHome languageContext={languageContext} />} />
        <Route path="/cattle" element={<CattleManagement languageContext={languageContext} />} />
        <Route path="/cattle/add" element={<AddCattle languageContext={languageContext} />} />
        <Route path="/cattle/view/:id" element={<ViewCattle />} />
        <Route path="/cattle/edit/:id" element={<EditCattle />} />
        <Route path="/all-transactions" element={<AllTransactions />} />
        <Route path="/transactions" element={<AllTransactions />} />
        <Route path="/food-history" element={<FoodHistory />} />
        <Route path="/food-history/add" element={<AddFoodHistory />} />
        <Route path="/food-history/view/:id" element={<ViewFoodHistory />} />
        <Route path="/food-history/edit/:id" element={<EditFoodHistory />} />
        <Route path="/health-history" element={<HealthHistory />} />
        <Route path="/health-history/add" element={<AddHealthRecord />} />
        {/* TODO: Create ViewHealthRecord and EditHealthRecord components */}
        {/* <Route path="/health-history/view/:id" element={<ViewHealthRecord />} /> */}
        {/* <Route path="/health-history/edit/:id" element={<EditHealthRecord />} /> */}
        <Route path="/medicine" element={<MedicineList />} />
        <Route path="/medicine/add" element={<AddMedicine />} />
        <Route path="/medicine/view/:id" element={<ViewMedicine />} />
        <Route path="/medicine/edit/:id" element={<EditMedicine />} />
        <Route path="/sheds" element={<ShedList />} />
        <Route path="/sheds/add" element={<AddShed />} />
        <Route path="/sheds/edit/:id" element={<EditShed />} />
        <Route path="/sheds/detail/:shedNumber" element={<ShedDetail />} />
        <Route path="/sheds/capacity" element={<ShedCapacityDashboard />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/inventory/add" element={<AddInventory />} />
        <Route path="/inventory/edit/:id" element={<EditInventory />} />
        <Route path="/inventory/:id/stock-history" element={<InventoryStockHistory />} />
        <Route path="/milk-production" element={<MilkProductionList />} />
        <Route path="/production" element={<MilkProductionList />} />
        <Route path="/production/record" element={<RecordMilkProduction />} />
        <Route path="/production/analytics" element={<MilkAnalytics />} />
        <Route path="/rfid-analytics" element={<RFIDAnalytics />} />
        <Route path="/rfid/scans" element={<RFIDScanHistory />} />
        <Route path="/rfid/analytics" element={<RFIDAnalytics />} />
      </Routes>
    </BaseLayout>
  );
}