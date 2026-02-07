import { useState } from 'react';
import DashboardLayout from '@/components/app/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  HomeIcon,
  UserIcon,
  FileTextIcon,
  UploadIcon,
  BellIcon,
  KeyIcon,
  FileIcon,
  UserCheckIcon,
  ClockIcon,
  ActivityIcon,
  EditIcon,
  CloudUploadIcon,
  CheckCircle2Icon,
  XCircleIcon,
  TrashIcon,
  DownloadIcon,
  CalendarIcon,
  ShieldCheckIcon,
  SearchIcon,
  FilterIcon,
  LockIcon,
  UsersIcon,
  HistoryIcon,
  FileCheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFetchApi, useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import {
  dashboardService,
  accessRequestsService,
  recordsService,
  permissionsService,
  auditLogService,
  profileService,
} from '@/services/api';
import type { PatientProfile } from '@/types/api.types';

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    recordType: '',
    recordDate: '',
    description: '',
  });

  const { user } = useAuth();

  // Fetch patient profile
  const {
    data: profileData,
    refetch: refetchProfile,
  } = useFetchApi(() => profileService.getMyPatientProfile(), []);

  // Fetch dashboard data
  const {
    data: dashboardData,
    loading: dashboardLoading,
    refetch: refetchDashboard,
  } = useFetchApi(() => dashboardService.getPatientDashboard(), []);

  // Fetch medical records
  const {
    data: recordsData,
    loading: recordsLoading,
    refetch: refetchRecords,
  } = useFetchApi(() => recordsService.getMyRecords(), []);

  // Fetch access requests
  const {
    data: accessRequestsData,
    loading: accessRequestsLoading,
    refetch: refetchAccessRequests,
  } = useFetchApi(() => accessRequestsService.getMyAccessRequests(), []);

  // Fetch permissions
  const {
    data: permissionsData,
    loading: permissionsLoading,
    refetch: refetchPermissions,
  } = useFetchApi(() => permissionsService.getMyPermissions(), []);

  // Fetch audit logs
  const {
    data: auditLogData,
    loading: auditLogLoading,
    refetch: refetchAuditLog,
  } = useFetchApi(() => auditLogService.getMyAuditLog(), []);

  // API mutations
  const approveRequestApi = useApi(accessRequestsService.approveRequest);
  const denyRequestApi = useApi(accessRequestsService.denyRequest);
  const revokePermissionApi = useApi(permissionsService.revokePermission);
  const deleteRecordApi = useApi(recordsService.deleteRecord);
  const uploadRecordApi = useApi(recordsService.uploadRecord);
  const updateProfileApi = useApi(profileService.updateMyPatientProfile);

  const currentUser = profileData?.data
    ? {
        id: profileData.data.id,
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: profileData.data.emergencyContact || '',
        dateOfBirth: profileData.data.dateOfBirth || '',
        gender: profileData.data.gender || '',
        bloodGroup: profileData.data.bloodType || '',
        address: profileData.data.address || '',
        blockchainAddress: user?.blockchainAddress || '',
      }
    : {
        id: '',
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        address: '',
        blockchainAddress: user?.blockchainAddress || '',
      };

  const stats = dashboardData?.data
    ? {
        totalRecords: dashboardData.data.cards.totalRecords,
        authorizedUsers: dashboardData.data.cards.authorizedUsers,
        pendingRequests: dashboardData.data.cards.pendingRequests,
        recentActivity: dashboardData.data.recentActivities?.length || 0,
        recordsThisMonth: 0,
      }
    : {
        totalRecords: 0,
        authorizedUsers: 0,
        pendingRequests: 0,
        recentActivity: 0,
        recordsThisMonth: 0,
      };

  const medicalRecords = recordsData?.data || [];
  const accessRequests = accessRequestsData?.data || [];
  const permissions = permissionsData?.data || [];
  const auditLogs = auditLogData?.data?.entries || [];

  // Action handlers
  const handleApproveRequest = async (requesterAddress: string, requesterName: string) => {
    try {
      await approveRequestApi.execute(requesterAddress);
      toast.success(`Approved access for ${requesterName}`);
      refetchAccessRequests();
      refetchPermissions();
      refetchDashboard();
      refetchAuditLog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve request');
    }
  };

  const handleDenyRequest = async (requesterAddress: string, requesterName: string) => {
    try {
      await denyRequestApi.execute(requesterAddress);
      toast.error(`Denied access for ${requesterName}`);
      refetchAccessRequests();
      refetchDashboard();
      refetchAuditLog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to deny request');
    }
  };

  const handleRevokePermission = async (userAddress: string, userName: string) => {
    try {
      await revokePermissionApi.execute(userAddress);
      toast.info(`Revoked access for ${userName}`);
      refetchPermissions();
      refetchDashboard();
      refetchAuditLog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke permission');
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      await deleteRecordApi.execute(recordId);
      toast.success('Record deleted successfully');
      refetchRecords();
      refetchDashboard();
      refetchAuditLog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete record');
    }
  };

  const handleUploadRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }
    if (!uploadFormData.title || !uploadFormData.recordType || !uploadFormData.recordDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await uploadRecordApi.execute({
        title: uploadFormData.title,
        recordType: uploadFormData.recordType,
        recordDate: uploadFormData.recordDate,
        description: uploadFormData.description,
        file: selectedFile,
      });
      toast.success('Record uploaded successfully!');
      setActiveSection('records');
      setSelectedFile(null);
      setUploadFormData({
        title: '',
        recordType: '',
        recordDate: '',
        description: '',
      });
      refetchRecords();
      refetchDashboard();
      refetchAuditLog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload record');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedData: Partial<PatientProfile> = {
        dateOfBirth: currentUser.dateOfBirth,
        gender: currentUser.gender,
        bloodType: currentUser.bloodGroup,
        address: currentUser.address,
        emergencyContact: currentUser.phone,
      };
      await updateProfileApi.execute(updatedData);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
      refetchProfile();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  // Navigation items
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      section: 'dashboard',
    },
    {
      id: 'records',
      label: 'Medical Records',
      icon: <FileTextIcon className="w-5 h-5" />,
      section: 'records',
    },
    {
      id: 'upload',
      label: 'Upload Record',
      icon: <UploadIcon className="w-5 h-5" />,
      section: 'upload',
    },
    {
      id: 'access',
      label: 'Access Requests',
      icon: <BellIcon className="w-5 h-5" />,
      badge: stats.pendingRequests,
      section: 'access',
    },
    {
      id: 'permissions',
      label: 'Permissions',
      icon: <KeyIcon className="w-5 h-5" />,
      section: 'permissions',
    },
    {
      id: 'audit',
      label: 'Audit Log',
      icon: <HistoryIcon className="w-5 h-5" />,
      section: 'audit',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <UserIcon className="w-5 h-5" />,
      section: 'profile',
    },
  ];

  const getBreadcrumbs = () => {
    const sectionBreadcrumbs: Record<
      string,
      Array<{ label: string; href?: string }>
    > = {
      dashboard: [],
      profile: [{ label: 'My Profile' }],
      records: [{ label: 'Medical Records' }],
      upload: [
        { label: 'Medical Records', href: 'records' },
        { label: 'Upload' },
      ],
      access: [{ label: 'Access Requests' }],
      permissions: [{ label: 'Permissions' }],
      audit: [{ label: 'Audit Log' }],
    };
    return sectionBreadcrumbs[activeSection] || [];
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  // Helper functions
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7)
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const getRecordTypeBadge = (type: string) => {
    const config: Record<string, { label: string; className: string }> = {
      lab: {
        label: 'Lab Results',
        className: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
      },
      prescription: {
        label: 'Prescription',
        className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
      },
      imaging: {
        label: 'Imaging',
        className: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
      },
      diagnosis: {
        label: 'Diagnosis',
        className: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
      },
    };
    const { label, className } = config[type] || {
      label: 'Other',
      className: 'bg-secondary text-secondary-foreground',
    };
    return (
      <Badge variant="outline" className={cn('border-none', className)}>
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      PENDING: {
        label: 'Pending',
        className: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
      },
      pending: {
        label: 'Pending',
        className: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
      },
      APPROVED: {
        label: 'Approved',
        className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
      },
      approved: {
        label: 'Approved',
        className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
      },
      DENIED: {
        label: 'Denied',
        className: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
      },
      denied: {
        label: 'Denied',
        className: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
      },
      active: {
        label: 'Active',
        className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
      },
      expired: {
        label: 'Expired',
        className: 'bg-muted text-muted-foreground',
      },
      revoked: {
        label: 'Revoked',
        className: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
      },
    };
    const { label, className } = config[status] || config.PENDING;
    return (
      <Badge variant="outline" className={cn('border-none', className)}>
        {label}
      </Badge>
    );
  };

  // Dashboard Section
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Stats Grid */}
      {dashboardLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-muted/30 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Records"
            value={stats.totalRecords}
            icon={FileIcon}
            description={`+${stats.recordsThisMonth} this month`}
            trend={{
              value: stats.recordsThisMonth,
              label: 'new this month',
              trend: 'up',
            }}
            variant="gradient"
          />
          <StatsCard
            title="Authorized Users"
            value={stats.authorizedUsers}
            icon={UserCheckIcon}
            description="Active permissions"
            trend={{ value: 1, label: 'new access', trend: 'up' }}
          />
          <StatsCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={ClockIcon}
            description="Awaiting review"
            trend={{ value: 2, label: 'since yesterday', trend: 'neutral' }}
          />
          <StatsCard
            title="Recent Activity"
            value={stats.recentActivity}
            icon={ActivityIcon}
            description="Last 30 days"
          />
        </div>
      )}

      {/* Activity and Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="col-span-1 lg:col-span-4 border-muted/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on your records</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {auditLogLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ActivityFeed activities={auditLogs} maxItems={5} className="pr-0" />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 border-muted/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                Access Requests
                {stats.pendingRequests > 0 && (
                  <Badge variant="destructive" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                    {stats.pendingRequests}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Review pending requests</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {accessRequestsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {accessRequests
                    .filter((r) => r.status === 'PENDING')
                    .slice(0, 3)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="p-4 bg-muted/30 border border-muted/40 rounded-xl"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName || 'Unknown')}&background=random`}
                            />
                            <AvatarFallback>
                              {(req.requesterName || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {req.requesterName || 'Unknown'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {req.requesterSpecialty || req.requesterRole || 'Healthcare Professional'}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {req.reason || 'Access request'}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 h-8"
                            onClick={() =>
                              handleApproveRequest(
                                req.requesterAddress,
                                req.requesterName || 'User'
                              )
                            }
                            disabled={approveRequestApi.loading}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-destructive hover:text-destructive"
                            onClick={() =>
                              handleDenyRequest(
                                req.requesterAddress,
                                req.requesterName || 'User'
                              )
                            }
                            disabled={denyRequestApi.loading}
                          >
                            Deny
                          </Button>
                        </div>
                      </div>
                    ))}
                  {accessRequests.filter((r) => r.status === 'PENDING').length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                      <CheckCircle2Icon className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-sm">No pending requests</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Profile Section
  const renderProfile = () => (
    <Card className="border-muted/40 shadow-sm max-w-4xl mx-auto animate-in fade-in-50 duration-500">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
        <div>
          <CardTitle className="text-xl">My Profile</CardTitle>
          <CardDescription>Manage your personal and medical information</CardDescription>
        </div>
        {!isEditingProfile ? (
          <Button onClick={() => setIsEditingProfile(true)}>
            <EditIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProfile}
              disabled={updateProfileApi.loading}
            >
              {updateProfileApi.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  defaultValue={currentUser.fullName}
                  disabled={!isEditingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={currentUser.email}
                  disabled={!isEditingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue={currentUser.phone}
                  disabled={!isEditingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  defaultValue={currentUser.dateOfBirth}
                  disabled={!isEditingProfile}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={3}
                defaultValue={currentUser.address}
                disabled={!isEditingProfile}
                className="resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select disabled={!isEditingProfile} defaultValue={currentUser.bloodGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select disabled={!isEditingProfile} defaultValue={currentUser.gender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Blockchain Address</span>
              </div>
              <p className="text-sm font-mono text-muted-foreground break-all">
                {currentUser.blockchainAddress}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/40 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Network</p>
                <p className="font-semibold text-foreground">Ganache (Local)</p>
              </div>
              <div className="p-4 bg-muted/40 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Encryption</p>
                <p className="font-semibold text-foreground">AES-128</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  // Medical Records Section
  const renderRecords = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card className="border-muted/40 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>View and manage your encrypted records</CardDescription>
            </div>
            <Button onClick={() => setActiveSection('upload')}>
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <FilterIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lab">Lab Results</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recordsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : medicalRecords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No medical records found</p>
              <Button className="mt-4" onClick={() => setActiveSection('upload')}>
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload First Record
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicalRecords
                .filter(
                  (record) =>
                    filterType === 'all' || record.recordType === filterType
                )
                .filter((record) =>
                  record.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((record) => (
                  <Card
                    key={record.id}
                    className="border-muted/40 hover:border-primary/50 transition-all cursor-pointer group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <FileIcon className="w-5 h-5" />
                        </div>
                        {getRecordTypeBadge(record.recordType)}
                      </div>
                      <CardTitle className="text-base line-clamp-1">
                        {record.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">
                        {record.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{formatDate(record.uploadedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-3 h-3" />
                          <span>By: You</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 bg-green-500/10 rounded border border-green-500/20">
                        <ShieldCheckIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="text-[10px] font-medium text-green-700 dark:text-green-400">
                          AES-128 Encrypted
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 h-8">
                          View
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteRecord(record.id)}
                          disabled={deleteRecordApi.loading}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Upload Section
  const renderUpload = () => (
    <Card className="border-muted/40 shadow-sm max-w-3xl mx-auto animate-in fade-in-50 duration-500">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <CloudUploadIcon className="w-5 h-5 text-primary" />
          Upload Medical Record
        </CardTitle>
        <CardDescription>
          Securely upload and encrypt your records on blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-6" onSubmit={handleUploadRecord}>
          <div className="space-y-2">
            <Label htmlFor="recordTitle">Record Title *</Label>
            <Input
              id="recordTitle"
              placeholder="e.g., Blood Test - Jan 2026"
              required
              value={uploadFormData.title}
              onChange={(e) =>
                setUploadFormData({ ...uploadFormData, title: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="recordType">Record Type *</Label>
              <Select
                value={uploadFormData.recordType}
                onValueChange={(value) =>
                  setUploadFormData({ ...uploadFormData, recordType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LAB_RESULTS">Lab Results</SelectItem>
                  <SelectItem value="PRESCRIPTION">Prescription</SelectItem>
                  <SelectItem value="IMAGING">Imaging/X-Ray</SelectItem>
                  <SelectItem value="DIAGNOSIS">Diagnosis</SelectItem>
                  <SelectItem value="VACCINATION">Vaccination</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recordDate">Record Date *</Label>
              <Input
                id="recordDate"
                type="date"
                required
                value={uploadFormData.recordDate}
                onChange={(e) =>
                  setUploadFormData({ ...uploadFormData, recordDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Details..."
              className="resize-none"
              value={uploadFormData.description}
              onChange={(e) =>
                setUploadFormData({ ...uploadFormData, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Upload File *</Label>
            <div
              className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:bg-muted/30 hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />
              <CloudUploadIcon className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, PNG, JPG (Max 10MB)
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={uploadRecordApi.loading}
            >
              {uploadRecordApi.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <CloudUploadIcon className="w-4 h-4 mr-2" />
                  Upload & Encrypt
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveSection('records')}
              disabled={uploadRecordApi.loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  // Access Requests Section
  const renderAccessRequests = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card className="border-muted/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-primary" />
            Access Requests
            {stats.pendingRequests > 0 && (
                <Badge variant="destructive" className="ml-2">
                    {stats.pendingRequests} Pending
                </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Review access requests from healthcare professionals
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({accessRequests.filter((r) => r.status === 'PENDING').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({accessRequests.filter((r) => r.status === 'APPROVED').length})
          </TabsTrigger>
          <TabsTrigger value="denied">
            Denied ({accessRequests.filter((r) => r.status === 'DENIED').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {accessRequestsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : accessRequests.filter((r) => r.status === 'PENDING').length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending requests found.</p>
            </div>
          ) : (
            accessRequests
              .filter((r) => r.status === 'PENDING')
              .map((req) => (
                <Card
                  key={req.id}
                  className="border-muted/40 hover:border-primary/40 transition-all shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left side - Doctor Info */}
                      <div className="flex items-start gap-4 lg:min-w-[280px]">
                        <Avatar className="h-14 w-14 border-2 border-background">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName || 'Unknown')}&background=random`}
                          />
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base">
                              {req.requesterName || 'Unknown'}
                            </h3>
                            {getStatusBadge(req.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {req.requesterSpecialty || req.requesterRole || 'Healthcare Professional'}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-1">
                            {req.requesterAddress}
                          </p>
                        </div>
                      </div>

                      {/* Right side - Request Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                            Reason
                          </Label>
                          <p className="text-sm mt-1">{req.reason || 'No reason provided'}</p>
                        </div>
                        <div className="flex gap-6">
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                              Requested
                            </Label>
                            <p className="text-sm font-medium mt-1">
                              {getRelativeTime(req.requestedAt)}
                            </p>
                          </div>
                        </div>

                        {/* Buttons inline on larger screens */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              handleDenyRequest(
                                req.requesterAddress,
                                req.requesterName || 'User'
                              )
                            }
                            disabled={denyRequestApi.loading}
                          >
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Deny
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleApproveRequest(
                                req.requesterAddress,
                                req.requesterName || 'User'
                              )
                            }
                            disabled={approveRequestApi.loading}
                          >
                            <CheckCircle2Icon className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          {accessRequestsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : accessRequests.filter((r) => r.status === 'APPROVED').length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No approved requests found.</p>
            </div>
          ) : (
            accessRequests
              .filter((r) => r.status === 'APPROVED')
              .map((req) => (
                <Card key={req.id} className="border-muted/40">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName || 'Unknown')}&background=random`}
                        />
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{req.requesterName || 'Unknown'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {req.requesterSpecialty || req.requesterRole || 'Healthcare Professional'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(req.status)}
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="denied" className="space-y-4 mt-6">
          {accessRequestsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : accessRequests.filter((r) => r.status === 'DENIED').length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No denied requests found.</p>
            </div>
          ) : (
            accessRequests
              .filter((r) => r.status === 'DENIED')
              .map((req) => (
                <Card key={req.id} className="border-muted/40">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName || 'Unknown')}&background=random`}
                        />
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{req.requesterName || 'Unknown'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {req.requesterSpecialty || req.requesterRole || 'Healthcare Professional'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(req.status)}
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  // Permissions Section
  const renderPermissions = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card className="border-muted/40 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <KeyIcon className="w-5 h-5 text-primary" />
                Permissions Management
              </CardTitle>
              <CardDescription>
                Control who can access your medical records
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UsersIcon className="w-4 h-4" />
              <span>{stats.authorizedUsers} Active Permissions</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {permissionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : permissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <KeyIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active permissions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Granted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm) => (
                  <TableRow key={perm.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(perm.userName || 'Unknown')}&background=random`}
                          />
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{perm.userName || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground font-mono max-w-[100px] truncate">
                            {perm.authorizedAddress}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {perm.userRole || 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(perm.grantedAt)}
                    </TableCell>
                    <TableCell>{getStatusBadge(perm.status)}</TableCell>
                    <TableCell className="text-right">
                      {perm.status === 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                          onClick={() =>
                            handleRevokePermission(
                              perm.authorizedAddress,
                              perm.userName || 'User'
                            )
                          }
                          disabled={revokePermissionApi.loading}
                        >
                          <LockIcon className="w-3 h-3 mr-1" />
                          Revoke
                        </Button>
                      )}
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

  // Audit Log Section
  const renderAuditLog = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card className="border-muted/40 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                Audit Log
              </CardTitle>
              <CardDescription>
                Complete immutable record of all actions on your medical data (stored on blockchain)
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary w-fit">
              <ShieldCheckIcon className="h-3 w-3 mr-1" />
              Blockchain Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {auditLogLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <HistoryIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit log entries found.</p>
              <p className="text-sm mt-2">Actions on your medical records will appear here.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>All entries are cryptographically verified on Ethereum blockchain</span>
                </div>
                <span>{auditLogs.length} {auditLogs.length === 1 ? 'entry' : 'entries'}</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Blockchain Proof</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log, index: number) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm">{log.description}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(log.date).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {log.actor.slice(0, 6)}...{log.actor.slice(-4)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <a
                            href={log.etherscanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <FileCheckIcon className="h-3 w-3" />
                            Block #{log.blockNumber}
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfile();
      case 'records':
        return renderRecords();
      case 'upload':
        return renderUpload();
      case 'access':
        return renderAccessRequests();
      case 'permissions':
        return renderPermissions();
      case 'audit':
        return renderAuditLog();
      default:
        return renderDashboard();
    }
  };

  return (
    <DashboardLayout
      userName={currentUser.fullName}
      walletAddress={currentUser.blockchainAddress}
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      breadcrumbs={getBreadcrumbs()}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default PatientDashboard;