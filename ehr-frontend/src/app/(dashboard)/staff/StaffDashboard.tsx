
import { useState } from 'react';
import DashboardLayout from '@/components/app/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  LayoutDashboard,
  Users,
  FileKey,
  Settings,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  FileText,
  UserPlus,
  EyeIcon,
  TrashIcon,
  EditIcon,
  PhoneIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StatsCard from '@/components/dashboard/StatsCard';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

// Mock Data for Staff Dashboard
const MOCK_STATS = {
  totalPatients: 1240,
  newPatientsThisMonth: 86,
  activeAccessRequests: 12,
  pendingVerifications: 5
};

// Chart data for patient registration trend
const chartData = [
  { date: "Jan 1", patients: 45 },
  { date: "Jan 2", patients: 23 },
  { date: "Jan 3", patients: 67 },
  { date: "Jan 4", patients: 45 },
  { date: "Jan 5", patients: 89 },
  { date: "Jan 6", patients: 56 },
  { date: "Jan 7", patients: 34 },
  { date: "Jan 8", patients: 78 },
  { date: "Jan 9", patients: 45 },
  { date: "Jan 10", patients: 92 },
  { date: "Jan 11", patients: 56 },
  { date: "Jan 12", patients: 78 },
  { date: "Jan 13", patients: 67 },
  { date: "Jan 14", patients: 45 },
  { date: "Jan 15", patients: 89 },
  { date: "Jan 16", patients: 76 },
  { date: "Jan 17", patients: 54 },
  { date: "Jan 18", patients: 87 },
  { date: "Jan 19", patients: 65 },
  { date: "Jan 20", patients: 43 },
  { date: "Jan 21", patients: 78 },
  { date: "Jan 22", patients: 92 },
  { date: "Jan 23", patients: 67 },
  { date: "Jan 24", patients: 54 },
  { date: "Jan 25", patients: 81 },
  { date: "Jan 26", patients: 69 },
  { date: "Jan 27", patients: 47 },
  { date: "Jan 28", patients: 85 },
  { date: "Jan 29", patients: 72 },
  { date: "Jan 30", patients: 58 },
];

const chartConfig = {
  patients: {
    label: "Patients",
    color: "hsl(24.6 95% 53.1%)",
  },
};

const MOCK_RECENT_PATIENTS = [
  { id: '1', name: 'Marvin Dekidis', age: 34, gender: 'Male', status: 'Active', lastVisit: '2 days ago', type: 'Outpatient' },
  { id: '2', name: 'Carter Lipshitz', age: 28, gender: 'Male', status: 'Pending', lastVisit: '1 week ago', type: 'Inpatient' },
  { id: '3', name: 'Addison Philips', age: 45, gender: 'Female', status: 'Active', lastVisit: '3 days ago', type: 'Emergency' },
  { id: '4', name: 'Craig Siphron', age: 52, gender: 'Male', status: 'Hold', lastVisit: '1 month ago', type: 'Outpatient' },
  { id: '5', name: 'Emma Johnson', age: 29, gender: 'Female', status: 'Active', lastVisit: 'Yesterday', type: 'Checkup' },
];

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const totalRecords = 24;

  const navItems = [
    { id: 'nav-dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'dashboard' },
    { id: 'nav-patients', label: 'Patients', icon: <Users className="w-4 h-4" />, section: 'patients' },
    { id: 'nav-requests', label: 'Access Requests', icon: <FileKey className="w-4 h-4" />, badge: 3, section: 'requests' },
    { id: 'nav-settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, section: 'settings' },
  ];

  const getBreadcrumbs = () => {
    switch (activeSection) {
      case 'dashboard': return [{ label: 'Dashboard', href: '/staff' }];
      case 'patients': return [{ label: 'Dashboard', href: '/staff' }, { label: 'Patients' }];
      case 'requests': return [{ label: 'Dashboard', href: '/staff' }, { label: 'Access Requests' }];
      case 'settings': return [{ label: 'Dashboard', href: '/staff' }, { label: 'Settings' }];
      default: return [{ label: 'Dashboard', href: '/staff' }];
    }
  };

  // --- Render Sections ---

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      
      {/* Top Stats Row matches "Sales Dashboard" top row but for Medical Staff */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Patients"
          value={MOCK_STATS.totalPatients.toLocaleString()}
          icon={Users}
          trend={{ value: 12, label: "vs last month", trend: 'up' }}
          variant="gradient"
        />
        <StatsCard
          title="New Registrations"
          value={MOCK_STATS.newPatientsThisMonth}
          icon={UserPlus}
          trend={{ value: 5.2, label: "vs last month", trend: 'up' }}
        />
        <StatsCard
          title="Access Requests"
          value={MOCK_STATS.activeAccessRequests}
          icon={FileKey}
          trend={{ value: 2, label: "pending review", trend: 'down' }} 
        />
        <StatsCard
          title="Verifications"
          value={MOCK_STATS.pendingVerifications}
          icon={FileText}
          trend={{ value: 0, label: "all up to date", trend: 'neutral' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Area - "Registration Trend" with Area Chart */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-foreground">Patient Registration Trend</CardTitle>
            <CardDescription>New patient onboardings over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-patients)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-patients)"
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(4)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="patients"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Side Panel - "Quick Actions" */}
        <div className="space-y-6">
             <Card className="border-border/50 shadow-sm bg-card h-full">
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-4 p-4 h-auto hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all group"
                      onClick={() => {
                        setActiveSection('patients');
                        toast.success('Opening patient registration form...');
                      }}
                    >
                        <div className="p-2 bg-green-100 rounded-full text-green-600 group-hover:bg-green-200">
                             <UserPlus className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-sm">Register Patient</div>
                            <div className="text-xs text-muted-foreground group-hover:text-green-600/70">Add new profile to blockchain</div>
                        </div>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-4 p-4 h-auto hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group"
                      onClick={() => {
                        setActiveSection('requests');
                        toast.info('Opening access requests...');
                      }}
                    >
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-200">
                             <FileKey className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-sm">Request Access</div>
                            <div className="text-xs text-muted-foreground group-hover:text-blue-600/70">View existing patient records</div>
                        </div>
                    </Button>

                     <Button 
                       variant="outline" 
                       className="w-full justify-start gap-4 p-4 h-auto hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all group"
                       onClick={() => {
                         setActiveSection('patients');
                         toast.info('Search feature coming soon!');
                       }}
                     >
                        <div className="p-2 bg-purple-100 rounded-full text-purple-600 group-hover:bg-purple-200">
                             <Search className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-sm">Search Directory</div>
                            <div className="text-xs text-muted-foreground group-hover:text-purple-600/70">Global patient lookup</div>
                        </div>
                    </Button>
                </CardContent>
             </Card>
        </div>
      </div>

      {/* Patient List (Track Order Status style) */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
                 <CardTitle className="text-lg">Recent Patients</CardTitle>
                 <CardDescription>Patients accessed or registered recently</CardDescription>
            </div>
            <div className="flex gap-2">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="gap-2"
                   onClick={() => toast.info('Opening filter options...')}
                 >
                    <Filter className="w-3.5 h-3.5" /> Filter
                 </Button>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="gap-2"
                   onClick={() => toast.success('Exporting patient list...')}
                 >
                    Export
                 </Button>
            </div>
        </CardHeader>
        <CardContent className="p-0">
             <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Age / Gender</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_RECENT_PATIENTS.map((p) => (
                        <TableRow key={p.id} className="hover:bg-muted/30 cursor-pointer transition-colors">
                            <TableCell className="font-medium text-muted-foreground">#{1080 + parseInt(p.id)}</TableCell>
                            <TableCell>
                                <div className="font-medium text-foreground">{p.name}</div>
                                <div className="text-xs text-muted-foreground">Last visit: {p.lastVisit}</div>
                            </TableCell>
                            <TableCell className="text-foreground">{p.age} • {p.gender}</TableCell>
                            <TableCell>{p.type}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={cn(
                                    "font-normal rounded-full",
                                    p.status === 'Active' ? "text-green-600 bg-green-50 hover:bg-green-100" : 
                                    p.status === 'Pending' ? "text-amber-600 bg-amber-50 hover:bg-amber-100" :
                                    "text-muted-foreground bg-muted hover:bg-muted/80"
                                )}>
                                    {p.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem 
                                      className="cursor-pointer"
                                      onClick={() => toast.success(`Viewing ${p.name}'s details...`)}
                                    >
                                      <EyeIcon className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="cursor-pointer"
                                      onClick={() => toast.info(`Editing ${p.name}'s profile...`)}
                                    >
                                      <EditIcon className="mr-2 h-4 w-4" />
                                      Edit Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="cursor-pointer"
                                      onClick={() => toast.info(`Calling ${p.name}...`)}
                                    >
                                      <PhoneIcon className="mr-2 h-4 w-4" />
                                      Contact
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="cursor-pointer text-destructive focus:text-destructive"
                                      onClick={() => toast.error(`Deleting ${p.name}...`)}
                                    >
                                      <TrashIcon className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
        </CardContent>
        <div className="p-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * recordsPerPage + 1}-{Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} patients
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[...Array(Math.ceil(totalRecords / recordsPerPage))].map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === Math.ceil(totalRecords / recordsPerPage) || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalRecords / recordsPerPage), prev + 1))}
                    className={currentPage === Math.ceil(totalRecords / recordsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
        </div>
      </Card>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Patient Directory</h2>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
              onClick={() => toast.success('Opening patient registration form...')}
            >
                <Plus className="w-4 h-4" /> Add Patient
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardDescription>Search and manage all patients in your department.</CardDescription>
                <div className="pt-4">
                     <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search patients by name, ID, or email..." className="pl-9 bg-muted/50 border-none" />
                        </div>
                        <Select defaultValue="all">
                             <SelectTrigger className="w-[180px] bg-muted/50 border-none">
                                <SelectValue placeholder="Status" />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                             </SelectContent>
                        </Select>
                     </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground border-dashed border-2 rounded-lg bg-muted/10">
                    <Users className="w-10 h-10 mb-2 opacity-50" />
                    <span className="font-medium">Patient list placeholder</span>
                    <span className="text-xs opacity-70">Integration with backend pending</span>
                 </div>
            </CardContent>
        </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
           <p className="text-muted-foreground">Manage your account preferences and dashboard settings.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input defaultValue="Admin Staff" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input defaultValue="staff@hospital.com" />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Input defaultValue="Senior Administrator" disabled className="bg-muted" />
                </div>
                <Button onClick={() => toast.success('Profile updated successfully!')}>Save Changes</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                        <div className="text-sm font-medium">Email Notifications</div>
                        <div className="text-xs text-muted-foreground">Receive daily summaries</div>
                    </div>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => toast.success('Email notifications disabled')}
                     >
                       Enabled
                     </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                        <div className="text-sm font-medium">New Patient Alerts</div>
                        <div className="text-xs text-muted-foreground">Notify when patient registers</div>
                    </div>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => toast.success('Patient alerts disabled')}
                     >
                       Enabled
                     </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                        <div className="text-sm font-medium">System Updates</div>
                        <div className="text-xs text-muted-foreground">Browser notifications for downtime</div>
                    </div>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="text-muted-foreground"
                       onClick={() => toast.success('System updates enabled')}
                     >
                       Disabled
                     </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );

  // Content Renderer
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderOverview();
      case 'patients': return renderPatients();
      case 'requests': return <div className="p-8 text-center text-muted-foreground">Access Requests Module (Coming Soon)</div>;
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <DashboardLayout
      userName="Staff Member"
      walletAddress="0x71C...9A21"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      breadcrumbs={getBreadcrumbs()}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default StaffDashboard;
