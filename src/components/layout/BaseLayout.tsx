/**
 * BaseLayout - Reusable layout component with top navbar and left sidebar
 * This is the foundation layout that all modules should use for consistency
 * Uses shadcn/ui components for professional design system compliance
 */

import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Search, Bell, Menu, X, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '@/services/admin/profile.service';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export interface NavigationItem {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  isActive?: boolean;
  badge?: string | number;
}

export interface BreadcrumbItem {
  label: string;
  url?: string;
  onClick?: () => void;
}

export interface BaseLayoutProps {
  /** Module name displayed in the navbar (e.g., "Gausakhi") */
  moduleName: string;
  /** Navigation items for the left sidebar */
  navigationItems: NavigationItem[];
  /** Main content to render */
  children: ReactNode;
  /** Optional module subtitle */
  moduleSubtitle?: string;
  /** Optional user info in top right */
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
  };
  /** Breadcrumb items to show navigation path */
  breadcrumbs?: BreadcrumbItem[];
  /** Custom className for the main content area */
  contentClassName?: string;
}

export default function BaseLayout({
  moduleName,
  navigationItems,
  children,
  moduleSubtitle,
  userInfo,
  breadcrumbs,
  contentClassName
}: BaseLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);

      // Call ProfileService logout (real Auth Service API)
      await profileService.logout();

      // Also call AuthContext logout to clear local state
      await logout();

      toast.success('Logged out successfully');

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      logger.error('Logout error:', error);
      toast.error(errorMessage);

      // Even on error, we should navigate to login since tokens are cleared
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar - Fixed position */}
      <aside className={`fixed left-0 top-0 w-56 h-screen bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } xl:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Module Title */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2 p-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-bold text-gray-900">{moduleName}</h1>
            </div>
          </div>

          {/* Mobile close button */}
          <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">Menu</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Module subtitle */}
          {moduleSubtitle && (
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-600">{moduleSubtitle}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-3">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  variant={item.isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start h-10 font-medium text-sm transition-all duration-200 ${
                    item.isActive
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className={`mr-3 flex-shrink-0 ${item.isActive ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.isActive ? "outline" : "secondary"}
                      className={`ml-auto text-xs ${
                        item.isActive
                          ? 'border-white/30 text-white bg-white/10'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              System Online
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Offset by sidebar width */}
      <div className="xl:ml-56 min-h-screen">
        {/* Top Navbar - Fixed */}
        <header className="fixed top-0 left-0 right-0 xl:left-56 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-2 p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SAUBHAGYA</h2>
              <div className="text-xs text-blue-600 font-medium">Unified Platform</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
              <span className="sr-only">Search</span>
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-2 w-2 p-0 text-[10px] flex items-center justify-center"
              >
                2
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>

            <Button variant="ghost" size="sm">
              <span className="text-sm font-medium">हिं</span>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {userInfo && (
              <div className="flex items-center space-x-3">
                <div className="text-right text-sm hidden md:block">
                  <div className="font-medium text-gray-900">{userInfo.name}</div>
                  <div className="text-xs text-gray-500">{userInfo.role}</div>
                </div>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt={userInfo.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-white text-xs font-medium">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogoutClick}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="fixed top-16 left-0 right-0 xl:left-56 h-12 bg-gray-50 border-b border-gray-200 z-30 flex items-center px-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  {item.onClick || item.url ? (
                    <button
                      onClick={item.onClick}
                      className="hover:text-blue-600 transition-colors font-medium hover:underline"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className={index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : ""}>
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main
          className={cn(
            "pt-20 min-h-screen w-full p-6",
            breadcrumbs && breadcrumbs.length > 0 ? "pt-20 mt-12" : "pt-20",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleLogoutCancel}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogoutConfirm}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}