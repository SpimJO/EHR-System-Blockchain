
import { Button } from '@/components/ui/button';
import {
  LogOutIcon,
  MoonIcon,
  SunIcon,
  SearchIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { clearSession } from '@/lib/ehr/session';
import { useNavigate } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Kbd } from '@/components/ui/kbd';
import { Logo } from '@/components/brand/Logo';
import React from 'react';

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
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userName = 'User',
  userAvatar,
  walletAddress = 'Not Connected',
  navItems,
  activeSection,
  onSectionChange,
  breadcrumbs,
}) => {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const avatarUrl =
    userAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=18181b&color=fff`;

  const getUserInitials = () => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    console.log('Searching for:', query);
    // TODO: Implement search across records, requests, etc.
  };

  const handleLogout = () => {
    clearSession();
    localStorage.clear();
    navigate({ to: '/auth/login' });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background relative selection:bg-primary/20 font-sans text-foreground">
        {/* Beautiful Mesh Gradient Background */}
        <div className="fixed inset-0 mesh-gradient z-[-2] pointer-events-none" />
        
        {/* Subtle Grain Texture */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.03] z-[-1] pointer-events-none" />

        {/* Shadcn Sidebar - Enhanced */}
        <Sidebar className="border-r border-sidebar-border/50 bg-sidebar/80 backdrop-blur-xl" collapsible="icon">
          <SidebarHeader className="p-4 mb-2">
            <Logo size="md" className="px-2" />
          </SidebarHeader>

          <SidebarContent className="px-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.id} className="mb-1">
                      <SidebarMenuButton
                        onClick={() => onSectionChange(item.section)}
                        isActive={activeSection === item.section}
                        className={cn(
                          'h-11 px-3.5 transition-all duration-200 rounded-xl',
                          activeSection === item.section 
                            ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25' 
                            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                        )}
                      >
                        <span className={cn('transition-colors', activeSection === item.section ? 'text-primary-foreground' : 'text-muted-foreground/70')}>
                          {item.icon}
                        </span>
                        <span className="text-[15px]">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge className={cn(
                            "ml-auto h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px] font-bold",
                            activeSection === item.section 
                              ? "bg-white/20 text-white hover:bg-white/30" 
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          )}>
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            {/* User Card with Gradient Border */}
            <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-primary/50 via-orange-400/50 to-primary/50">
              <div className="rounded-xl bg-card p-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-lg cursor-pointer hover:scale-105 transition-transform">
                      <AvatarImage src={avatarUrl} alt={userName} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                  </div>
                  <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-semibold truncate text-foreground">{userName}</span>
                    <span className="text-[10px] text-muted-foreground truncate font-mono">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Top Bar - Modern Glass Effect */}
          <header className="px-8 py-4 flex items-center justify-between z-10 w-full border-b border-border/30 bg-background/50 backdrop-blur-lg"> 
            
            <div className="flex flex-col gap-0.5">
              {/* Optional Breadcrumbs */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60 mb-0.5">
                  {breadcrumbs.map((crumb, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="text-border">/</span>}
                      <span className="hover:text-primary transition-colors cursor-pointer">{crumb.label}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {navItems.find(n => n.section === activeSection)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative group hidden md:block">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  className="h-10 w-56 rounded-full border border-border/50 bg-card/80 pl-10 pr-4 text-sm outline-none ring-offset-background transition-all focus:w-72 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 hover:border-primary/30 placeholder:text-muted-foreground/50" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:hidden sm:flex gap-1 pointer-events-none">
                  <Kbd className="bg-muted/50 text-[10px] border-none shadow-none text-muted-foreground">⌘K</Kbd>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center bg-muted/50 rounded-full p-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    "hover:bg-background hover:shadow-sm"
                  )} 
                  onClick={() => setTheme('light')}
                >
                  <SunIcon className="h-4 w-4 text-orange-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    "hover:bg-background hover:shadow-sm"
                  )} 
                  onClick={() => setTheme('dark')}
                >
                  <MoonIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </Button>
              </div>
              
              {/* Logout Button */}
              <Button 
                variant="default" 
                className="rounded-full px-5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 ml-1" 
                onClick={handleLogout}
              >
                <LogOutIcon className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto px-8 py-6">
            <div className="mx-auto max-w-7xl animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

