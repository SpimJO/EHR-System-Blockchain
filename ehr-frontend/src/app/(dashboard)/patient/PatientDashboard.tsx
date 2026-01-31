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
  HistoryIcon,
  FileIcon,
  UserCheckIcon,
  ClockIcon,
  ActivityIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  CloudUploadIcon,
  CheckCircle2Icon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  DownloadIcon,
  CalendarIcon,
  ShieldCheckIcon,
  SearchIcon,
  FilterIcon,
  LockIcon,
  UsersIcon,
  FileCheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock user data - In production, fetched from /profile endpoint
  const currentUser = {
    id: '1',
    fullName: 'John Doe',
    email: 'patient@test.com',
    phone: '+1234567890',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    bloodGroup: 'O+',
    address: '123 Main St, City, State 12345',
    blockchainAddress: '0x1234...5678',
  };

  // Stats - From /dashboard/patient endpoint
  const stats = {
    totalRecords: 24,
    authorizedUsers: 5,
    pendingRequests: 3,
    recentActivity: 12,
    recordsThisMonth: 8,
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
      id: 'profile',
      label: 'My Profile',
      icon: <UserIcon className="w-5 h-5" />,
      section: 'profile',
    },
  ];

  // Mock data - In production from respective API endpoints
  const medicalRecords = [
    {
      id: '1',
      title: 'Blood Test Results',
      type: 'lab',
      description: 'Complete Blood Count (CBC)',
      uploadedAt: '2026-01-20T10:30:00Z',
      uploadedBy: 'Dr. Sarah Smith',
      fileSize: '245 KB',
      encrypted: true,
      hash: '0xabc...def',
    },
    {
      id: '2',
      title: 'X-Ray - Chest',
      type: 'imaging',
      description: 'Chest X-ray examination',
      uploadedAt: '2026-01-18T14:15:00Z',
      uploadedBy: 'Dr. Michael Johnson',
      fileSize: '1.2 MB',
      encrypted: true,
      hash: '0x123...456',
    },
    {
      id: '3',
      title: 'Prescription - Antibiotics',
      type: 'prescription',
      description: 'Amoxicillin 500mg',
      uploadedAt: '2026-01-15T09:00:00Z',
      uploadedBy: 'Dr. Sarah Smith',
      fileSize: '156 KB',
      encrypted: true,
      hash: '0x789...abc',
    },
  ];

  const accessRequests = [
    {
      id: '1',
      requesterName: 'Dr. Sarah Smith',
      requesterSpecialty: 'Cardiologist',
      requesterAddress: '0x5678...9ABC',
      reason: 'Follow-up consultation for cardiac evaluation',
      duration: '30 days',
      requestedAt: '2026-01-24T08:00:00Z',
      status: 'pending',
    },
    {
      id: '2',
      requesterName: 'Dr. Michael Johnson',
      requesterSpecialty: 'Radiologist',
      requesterAddress: '0xDEF0...1234',
      reason: 'Review imaging results',
      duration: '7 days',
      requestedAt: '2026-01-23T14:30:00Z',
      status: 'pending',
    },
    {
      id: '3',
      requesterName: 'Dr. Emily Chen',
      requesterSpecialty: 'General Physician',
      requesterAddress: '0x9876...5432',
      reason: 'Annual checkup',
      duration: '14 days',
      requestedAt: '2026-01-20T10:00:00Z',
      status: 'approved',
    },
  ];

  const permissions = [
    {
      id: '1',
      userName: 'Dr. Sarah Smith',
      userRole: 'Doctor',
      userAddress: '0x5678...9ABC',
      grantedAt: '2026-01-15T10:00:00Z',
      expiresAt: '2026-02-15T10:00:00Z',
      status: 'active',
      accessCount: 12,
    },
    {
      id: '2',
      userName: 'Nurse Jane Doe',
      userRole: 'Staff',
      userAddress: '0xABCD...EF12',
      grantedAt: '2026-01-10T09:00:00Z',
      expiresAt: '2026-02-10T09:00:00Z',
      status: 'active',
      accessCount: 5,
    },
  ];

  const auditLogs = [
    {
      id: '1',
      action: 'Record Uploaded',
      type: 'upload',
      performedBy: 'You',
      timestamp: 1768818600, // example timestamp
      details: 'Blood Test Results uploaded',
      txHash: '0xabc...def',
    },
    {
      id: '2',
      action: 'Access Granted',
      type: 'permission',
      performedBy: 'You',
      timestamp: 1768384800,
      details: 'Granted to Dr. Sarah Smith',
      txHash: '0x123...456',
    },
    {
      id: '3',
      action: 'Record Accessed',
      type: 'access',
      performedBy: 'Dr. Sarah Smith',
      timestamp: 1768486800,
      details: 'Viewed Blood Test Results',
      txHash: '0x789...abc',
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
    };
    return sectionBreadcrumbs[activeSection] || [];
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

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
        className: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
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
      pending: {
        label: 'Pending',
        className: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
      },
      approved: {
        label: 'Approved',
        className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
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
    const { label, className } = config[status] || config.pending;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Records"
          value={stats.totalRecords}
          icon={FileIcon}
          description={`+${stats.recordsThisMonth} this month`}
          trend={{ value: stats.recordsThisMonth, label: 'new this month', trend: 'up' }}
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
            <ActivityFeed activities={auditLogs as any} maxItems={5} className="pr-0" />
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
            <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                {accessRequests
                    .filter((r) => r.status === 'pending')
                    .slice(0, 3)
                    .map((req) => (
                    <div
                        key={req.id}
                        className="p-4 bg-muted/30 border border-muted/40 rounded-xl"
                    >
                        <div className="flex items-start gap-3 mb-3">
                        <Avatar>
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName)}&background=random`} />
                            <AvatarFallback>{req.requesterName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                            {req.requesterName}
                            </p>
                            <p className="text-xs text-muted-foreground">{req.requesterSpecialty}</p>
                        </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {req.reason}
                        </p>
                        <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="flex-1 h-8"
                            onClick={() => toast.success(`Approved ${req.requesterName}`)}
                        >
                            Approve
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-destructive hover:text-destructive"
                            onClick={() => toast.error(`Denied ${req.requesterName}`)}
                        >
                            Deny
                        </Button>
                        </div>
                    </div>
                    ))}
                    {accessRequests.filter((r) => r.status === 'pending').length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                             <CheckCircle2Icon className="h-8 w-8 mb-2 opacity-50" />
                             <p className="text-sm">No pending requests</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
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
                 <Button onClick={() => { setIsEditingProfile(false); toast.success('Profile updated!'); }}>
                     Save Changes
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicalRecords.map((record) => (
              <Card
                key={record.id}
                className="border-muted/40 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileIcon className="w-5 h-5" />
                    </div>
                    {getRecordTypeBadge(record.type)}
                  </div>
                  <CardTitle className="text-base line-clamp-1">{record.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {record.description}
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
                      <span>By: {record.uploadedBy}</span>
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
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success('Record uploaded!');
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="recordTitle">Record Title *</Label>
            <Input
              id="recordTitle"
              placeholder="e.g., Blood Test - Jan 2026"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="recordType">Record Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lab">Lab Results</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="imaging">Imaging/X-Ray</SelectItem>
                  <SelectItem value="diagnosis">Diagnosis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recordDate">Record Date *</Label>
              <Input id="recordDate" type="date" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Details..."
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Upload File *</Label>
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:bg-muted/30 hover:border-primary/50 transition-all cursor-pointer">
              <CloudUploadIcon className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, PNG, JPG (Max 10MB)
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <CloudUploadIcon className="w-4 h-4 mr-2" />
              Upload & Encrypt
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveSection('records')}
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
            Pending ({accessRequests.filter((r) => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({accessRequests.filter((r) => r.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="denied">Denied (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {accessRequests
            .filter((r) => r.status === 'pending')
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
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName)}&background=random`} />
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base">{req.requesterName}</h3>
                          {getStatusBadge(req.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{req.requesterSpecialty}</p>
                        <p className="text-xs font-mono text-muted-foreground mt-1">
                          {req.requesterAddress}
                        </p>
                      </div>
                    </div>
                    
                    {/* Right side - Request Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Reason</Label>
                        <p className="text-sm mt-1">{req.reason}</p>
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Duration</Label>
                          <p className="text-sm font-medium mt-1">{req.duration}</p>
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Requested</Label>
                          <p className="text-sm font-medium mt-1">{getRelativeTime(req.requestedAt)}</p>
                        </div>
                      </div>
                      
                      {/* Buttons inline on larger screens */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => toast.error(`Denied ${req.requesterName}`)}
                        >
                          <XCircleIcon className="w-4 h-4 mr-2" />
                          Deny
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => toast.success(`Approved ${req.requesterName}`)}
                        >
                          <CheckCircle2Icon className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {accessRequests.filter(r => r.status === 'pending').length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No pending requests found.
                </div>
            )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
            {/* Similar structure for approved requests, simplified */}
             {accessRequests
            .filter((r) => r.status === 'approved')
            .map((req) => (
                <Card key={req.id} className="border-muted/40">
                     <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                             <Avatar>
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName)}&background=random`} />
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">{req.requesterName}</h3>
                                <p className="text-sm text-muted-foreground">{req.requesterSpecialty}</p>
                            </div>
                        </div>
                         {getStatusBadge(req.status)}
                     </CardContent>
                </Card>
            ))}
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
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Granted</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Access Count</TableHead>
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
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(perm.userName)}&background=random`} />
                        </Avatar>
                        <div>
                        <p className="font-medium text-sm">{perm.userName}</p>
                        <p className="text-xs text-muted-foreground font-mono max-w-[100px] truncate">
                            {perm.userAddress}
                        </p>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell>
                    <Badge variant="secondary" className="font-normal">{perm.userRole}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                    {formatDate(perm.grantedAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                    {formatDate(perm.expiresAt)}
                    </TableCell>
                    <TableCell>
                         <div className="flex items-center gap-2">
                            <ActivityIcon className="h-3 w-3 text-muted-foreground" />
                            {perm.accessCount}
                         </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(perm.status)}</TableCell>
                    <TableCell className="text-right">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                        onClick={() => toast.info(`Revoked ${perm.userName}`)}
                    >
                        <LockIcon className="w-3 h-3 mr-1" />
                        Revoke
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
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