
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
  PhoneIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StatsCard from '@/components/dashboard/StatsCard';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useFetchApi, useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import {
  dashboardService,
  patientsService,
  accessRequestsService,
  profileService,
} from '@/services/api';

// Staff Dashboard component

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const [requestAccessForm, setRequestAccessForm] = useState({
    patientId: '',
    reason: '',
  });
  const recordsPerPage = 5;

  const { user } = useAuth();

  // Fetch staff dashboard data
  const {
    data: dashboardData,
    loading: dashboardLoading,
    refetch: refetchDashboard,
  } = useFetchApi(() => dashboardService.getStaffDashboard(), []);

  // Fetch my patients
  const {
    data: patientsData,
    loading: patientsLoading,
    refetch: refetchPatients,
  } = useFetchApi(() => patientsService.getMyPatients(), []);

  // Fetch outgoing access requests
  const {
    data: requestsData,
    loading: requestsLoading,
    refetch: refetchRequests,
  } = useFetchApi(() => accessRequestsService.getMyOutgoingRequests(), []);

  // Fetch staff profile
  const {
    data: profileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useFetchApi(() => profileService.getMyStaffProfile(), []);

  // API mutations
  const requestAccessApi = useApi(accessRequestsService.requestAccess);
  const updateProfileApi = useApi(profileService.updateMyStaffProfile);

  const stats = dashboardData?.data
    ? {
        totalPatients: dashboardData.data.cards.totalPatients || 0,
        recordsAccessed: dashboardData.data.cards.recordsAccessed || 0,
        pendingRequests: dashboardData.data.cards.pendingRequests || 0,
        recentActivity: dashboardData.data.recentActivity?.length || 0,
      }
    : {
        totalPatients: 0,
        recordsAccessed: 0,
        pendingRequests: 0,
        recentActivity: 0,
      };

  const patients = patientsData?.data?.patients || [];
  const totalRecords = patientsData?.data?.total || 0;

  // Action handlers
  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestAccessForm.patientId || !requestAccessForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await requestAccessApi.execute({
        patientId: requestAccessForm.patientId,
        reason: requestAccessForm.reason,
      });
      toast.success('Access request sent successfully!');
      setRequestAccessForm({ patientId: '', reason: '' });
      refetchRequests();
      refetchDashboard();
    } catch (error: any) {
      toast.error(error.message || 'Failed to request access');
    }
  };

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
      {/* Top Stats Row */}
      {dashboardLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/30 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients.toLocaleString()}
            icon={Users}
            trend={{ value: 12, label: 'vs last month', trend: 'up' }}
            variant="gradient"
          />
          <StatsCard
            title="Records Accessed"
            value={stats.recordsAccessed}
            icon={FileText}
            trend={{ value: 5.2, label: 'vs last month', trend: 'up' }}
          />
          <StatsCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={FileKey}
            trend={{ value: 2, label: 'awaiting approval', trend: 'neutral' }}
          />
          <StatsCard
            title="Recent Activity"
            value={stats.recentActivity}
            icon={UserPlus}
            trend={{ value: 0, label: 'actions this week', trend: 'neutral' }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Recent Patients Table - removed bar chart as requested */}
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Authorized Patients
                </CardTitle>
                <CardDescription>Patients you have access to</CardDescription>
              </div>
              <Button size="sm" onClick={() => setActiveSection('requests')}>
                <Plus className="w-4 h-4 mr-2" />
                Request Access
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {patientsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No authorized patients found</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => setActiveSection('requests')}
                >
                  Request access to a patient
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Accessed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.slice(0, 5).map((patient: any) => (
                    <TableRow key={patient.patientId}>
                      <TableCell className="font-medium">{patient.patientName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {patient.recordCount} record{patient.recordCount !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {patient.lastAccessed
                          ? new Date(patient.lastAccessed * 1000).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <EyeIcon className="mr-2 h-4 w-4" />
                              View Records
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Patients Section
  const renderPatients = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card className="border-muted/40 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>My Patients</CardTitle>
              <CardDescription>Patients you have access to</CardDescription>
            </div>
            <Button onClick={() => setActiveSection('requests')}>
              <Plus className="w-4 h-4 mr-2" />
              Request Access
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {patientsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No authorized patients found</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setActiveSection('requests')}
              >
                Request access to a patient
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Accessed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient: any) => (
                  <TableRow key={patient.patientId}>
                    <TableCell className="font-medium">{patient.patientName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {patient.recordCount} record{patient.recordCount !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {patient.lastAccessed
                        ? new Date(patient.lastAccessed * 1000).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View Records
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Access Requests Section (similar to Doctor Dashboard)
  const renderRequests = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Request Access</h2>
        <p className="text-muted-foreground">Request permission to view patient medical records.</p>
      </div>

      <Card className="border-muted/40 shadow-sm">
        <CardHeader>
          <CardTitle>New Request</CardTitle>
          <CardDescription>
            The patient will be notified and must approve your request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleRequestAccess}>
            <div className="space-y-2">
              <label htmlFor="patientId" className="text-sm font-medium">
                Patient ID or Email *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="patientId"
                  placeholder="Enter patient ID or email"
                  value={requestAccessForm.patientId}
                  onChange={(e) =>
                    setRequestAccessForm({ ...requestAccessForm, patientId: e.target.value })
                  }
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="requestReason" className="text-sm font-medium">
                Reason for Access *
              </label>
              <textarea
                id="requestReason"
                rows={4}
                placeholder="Explain why you need access to this patient's records..."
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={requestAccessForm.reason}
                onChange={(e) =>
                  setRequestAccessForm({ ...requestAccessForm, reason: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={requestAccessApi.loading}
            >
              {requestAccessApi.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Access Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  // Settings Section (placeholder)
  const renderSettings = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-500">
      <Card className="border-muted/40 shadow-sm">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderOverview();
      case 'patients':
        return renderPatients();
      case 'requests':
        return renderRequests();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout
      userName={user?.fullName || 'Staff Member'}
      walletAddress={user?.blockchainAddress || ''}
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
