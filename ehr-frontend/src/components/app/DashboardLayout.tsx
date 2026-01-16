import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ShieldCheckIcon,
  LogOutIcon,
  MenuIcon,
  WalletIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  section: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userAvatar?: string;
  walletAddress?: string;
  navItems: NavItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  pageTitle: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userName = 'User',
  userAvatar,
  walletAddress = 'Not Connected',
  navItems,
  activeSection,
  onSectionChange,
  pageTitle,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const avatarUrl =
    userAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`;

  const handleLogout = () => {
    // Logout functionality to be implemented
    console.log('Logout clicked');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300',
          !sidebarOpen && 'max-lg:-translate-x-full',
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-ehr-blue-600" />
            <span className="text-lg font-bold text-ehr-blue-600">EHR System</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.section);
                setSidebarOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-5 py-3 text-gray-700 transition-colors relative',
                'hover:bg-gray-50 hover:text-ehr-blue-600',
                activeSection === item.section &&
                  'bg-blue-50 text-ehr-blue-600 font-semibold before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-ehr-blue-600',
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 py-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
          >
            <LogOutIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <MenuIcon className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-6">
              {/* Wallet Info */}
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-ehr-blue-600 text-sm font-medium">
                <WalletIcon className="w-4 h-4" />
                <span className="hidden md:inline">{walletAddress}</span>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={avatarUrl} alt={userName} className="w-10 h-10 rounded-full" />
                <span className="hidden md:inline font-medium text-gray-700">{userName}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

