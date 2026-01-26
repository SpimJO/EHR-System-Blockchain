import { Button } from '@/components/ui/button';
import {
  ShieldCheckIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  WalletIcon,
  SearchIcon,
  CommandIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';
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

  const avatarUrl =
    userAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f59e0b&color=000`;

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const getUserInitials = () => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality to be implemented
  };

  // Avoid showing duplicate root breadcrumb when the breadcrumbs
  // already include the current page (e.g. "Dashboard").
  

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background relative">
        {/* Background Image & Overlay */}
        <div
          className="fixed inset-0 bg-cover bg-center -z-20"
          style={{ backgroundImage: "url('/bg-medical.jpg')" }}
        />
        <div className="fixed inset-0 bg-linear-to-br from-blue-900/60 via-teal-900/50 to-blue-950/70 dark:from-black/80 dark:via-gray-950/90 dark:to-black/95 -z-10" />

        {/* Shadcn Sidebar */}
        <Sidebar className="bg-white/95 dark:bg-card/95 backdrop-blur-md border-r-2 border-white/30 dark:border-border/40">
          <SidebarHeader className="border-b-2 border-white/30 dark:border-border/40 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-primary to-amber-600 rounded-lg shadow-lg">
                <ShieldCheckIcon className="w-6 h-6 text-black" />
              </div>
              <span className="text-lg font-bold bg-linear-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                EHR System
              </span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onSectionChange(item.section)}
                        isActive={activeSection === item.section}
                        className={cn(
                          'transition-all group',
                          activeSection === item.section &&
                            'bg-linear-to-r from-amber-100/90 to-amber-50/90 dark:from-amber-900/30 dark:to-amber-800/20 text-primary font-semibold hover:bg-linear-to-r hover:from-amber-100/90 hover:to-amber-50/90 dark:hover:from-amber-900/30 dark:hover:to-amber-800/20 border-l-4 border-primary shadow-sm'
                        )}
                      >
                        <span className={cn('transition-colors', activeSection === item.section && 'text-primary')}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge className="ml-auto bg-linear-to-r from-red-500 to-red-600 text-white text-xs border-0 shadow-md">
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

          <SidebarFooter className="border-t-2 border-white/30 dark:border-border/40 p-4">
            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-3 bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40 hover:bg-red-50/80 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white/95 dark:bg-card/95 backdrop-blur-md border-b-2 border-white/30 dark:border-border/40 shadow-lg">
            {/* Top Row - Main Navigation */}
            <div className="flex items-center justify-between gap-4 px-6 lg:px-8 py-3 border-b border-white/20 dark:border-border/30">
              <div className="flex items-center gap-4 flex-1">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6 hidden lg:block" />
                
                {/* Search with Keyboard Shortcut */}
                <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md">
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="search"
                      placeholder="Search records, patients..."
                    />
                    <InputGroupAddon align="inline-end">
                      <Kbd>
                        <CommandIcon className="w-3 h-3" />
                      </Kbd>
                      <Kbd>K</Kbd>
                    </InputGroupAddon>
                  </InputGroup>
                </form>
              </div>

              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40 hover:bg-amber-50/80 dark:hover:bg-amber-900/20 hover:text-primary hover:border-primary/40"
                    >
                      <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/95 dark:bg-card/95 backdrop-blur-md border-2 border-white/40 dark:border-border/40">
                    <DropdownMenuItem
                      onClick={() => setTheme('light')}
                      className="cursor-pointer focus:bg-amber-50/80 dark:focus:bg-amber-900/20 focus:text-primary"
                    >
                      <SunIcon className="w-4 h-4 mr-2" />
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme('dark')}
                      className="cursor-pointer focus:bg-amber-50/80 dark:focus:bg-amber-900/20 focus:text-primary"
                    >
                      <MoonIcon className="w-4 h-4 mr-2" />
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme('system')}
                      className="cursor-pointer focus:bg-amber-50/80 dark:focus:bg-amber-900/20 focus:text-primary"
                    >
                      <SunIcon className="w-4 h-4 mr-2" />
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Wallet Info */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-100/90 to-amber-50/90 dark:from-amber-900/30 dark:to-amber-800/20 backdrop-blur-sm border-2 border-white/40 dark:border-amber-700/40 rounded-lg text-primary text-sm font-medium shadow-md">
                  <WalletIcon className="w-4 h-4" />
                  <span className="hidden lg:inline">{walletAddress}</span>
                  <span className="lg:hidden">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-muted/30">
                      <Avatar className="w-10 h-10 border-2 border-white/60 dark:border-border shadow-lg">
                        <AvatarImage src={avatarUrl} alt={userName} />
                        <AvatarFallback className="bg-linear-to-br from-primary to-amber-600 text-black font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline font-medium text-foreground">{userName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-card/95 backdrop-blur-md border-2 border-white/40 dark:border-border/40">
                    <DropdownMenuItem
                      onClick={() => onSectionChange('profile')}
                      className="cursor-pointer focus:bg-amber-50/80 dark:focus:bg-amber-900/20 focus:text-primary"
                    >
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50/80 dark:focus:bg-red-950/40 focus:text-red-700 dark:focus:text-red-400"
                    >
                      <LogOutIcon className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Bottom Row - Breadcrumbs & Title */}
            <div className="px-6 lg:px-8 py-4">
              <div className="flex flex-col gap-2">
                {/* Breadcrumbs */}
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs && breadcrumbs.length > 0 && (
                      <>
                        {breadcrumbs.map((crumb, index) => (
                          <React.Fragment key={index}>
                            <BreadcrumbItem>
                              {index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink
                                  onClick={() => crumb.href && onSectionChange(crumb.href)}
                                  className={crumb.href ? 'cursor-pointer' : ''}
                                >
                                  {crumb.label}
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>

                {/* Page title intentionally removed to avoid duplication with breadcrumbs */}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

