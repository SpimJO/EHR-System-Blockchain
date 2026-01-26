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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" />, section: 'dashboard' },
    { id: 'profile', label: 'My Profile', icon: <UserIcon className="w-5 h-5" />, section: 'profile' },
    { id: 'records', label: 'Medical Records', icon: <FileTextIcon className="w-5 h-5" />, section: 'records' },
    { id: 'upload', label: 'Upload Record', icon: <UploadIcon className="w-5 h-5" />, section: 'upload' },
    { id: 'access', label: 'Access Requests', icon: <BellIcon className="w-5 h-5" />, badge: stats.pendingRequests, section: 'access' },
    { id: 'permissions', label: 'Permissions', icon: <KeyIcon className="w-5 h-5" />, section: 'permissions' },
    { id: 'audit', label: 'Audit Log', icon: <HistoryIcon className="w-5 h-5" />, section: 'audit' },
  ];

  // Mock data - In production from respective API endpoints
  const medicalRecords = [
    { id: '1', title: 'Blood Test Results', type: 'lab', description: 'Complete Blood Count (CBC)', uploadedAt: '2026-01-20T10:30:00Z', uploadedBy: 'Dr. Sarah Smith', fileSize: '245 KB', encrypted: true, hash: '0xabc...def' },
    { id: '2', title: 'X-Ray - Chest', type: 'imaging', description: 'Chest X-ray examination', uploadedAt: '2026-01-18T14:15:00Z', uploadedBy: 'Dr. Michael Johnson', fileSize: '1.2 MB', encrypted: true, hash: '0x123...456' },
    { id: '3', title: 'Prescription - Antibiotics', type: 'prescription', description: 'Amoxicillin 500mg', uploadedAt: '2026-01-15T09:00:00Z', uploadedBy: 'Dr. Sarah Smith', fileSize: '156 KB', encrypted: true, hash: '0x789...abc' },
  ];

  const accessRequests = [
    { id: '1', requesterName: 'Dr. Sarah Smith', requesterSpecialty: 'Cardiologist', requesterAddress: '0x5678...9ABC', reason: 'Follow-up consultation for cardiac evaluation', duration: '30 days', requestedAt: '2026-01-24T08:00:00Z', status: 'pending' },
    { id: '2', requesterName: 'Dr. Michael Johnson', requesterSpecialty: 'Radiologist', requesterAddress: '0xDEF0...1234', reason: 'Review imaging results', duration: '7 days', requestedAt: '2026-01-23T14:30:00Z', status: 'pending' },
    { id: '3', requesterName: 'Dr. Emily Chen', requesterSpecialty: 'General Physician', requesterAddress: '0x9876...5432', reason: 'Annual checkup', duration: '14 days', requestedAt: '2026-01-20T10:00:00Z', status: 'approved' },
  ];

  const permissions = [
    { id: '1', userName: 'Dr. Sarah Smith', userRole: 'Doctor', userAddress: '0x5678...9ABC', grantedAt: '2026-01-15T10:00:00Z', expiresAt: '2026-02-15T10:00:00Z', status: 'active', accessCount: 12 },
    { id: '2', userName: 'Nurse Jane Doe', userRole: 'Staff', userAddress: '0xABCD...EF12', grantedAt: '2026-01-10T09:00:00Z', expiresAt: '2026-02-10T09:00:00Z', status: 'active', accessCount: 5 },
  ];

  const auditLogs = [
    { id: '1', action: 'Record Uploaded', type: 'upload', performedBy: 'You', timestamp: '2026-01-20T10:30:00Z', details: 'Blood Test Results uploaded', txHash: '0xabc...def' },
    { id: '2', action: 'Access Granted', type: 'permission', performedBy: 'You', timestamp: '2026-01-15T10:00:00Z', details: 'Granted to Dr. Sarah Smith', txHash: '0x123...456' },
    { id: '3', action: 'Record Accessed', type: 'access', performedBy: 'Dr. Sarah Smith', timestamp: '2026-01-16T14:20:00Z', details: 'Viewed Blood Test Results', txHash: '0x789...abc' },
  ];

  const getBreadcrumbs = () => {
    const sectionBreadcrumbs: Record<string, Array<{ label: string; href?: string }>> = {
      dashboard: [],
      profile: [{ label: 'My Profile' }],
      records: [{ label: 'Medical Records' }],
      upload: [{ label: 'Medical Records', href: 'records' }, { label: 'Upload' }],
      access: [{ label: 'Access Requests' }],
      permissions: [{ label: 'Permissions' }],
      audit: [{ label: 'Audit Log' }],
    };
    return sectionBreadcrumbs[activeSection] || [];
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const getRecordTypeBadge = (type: string) => {
    const config: Record<string, { label: string; className: string }> = {
      lab: { label: 'Lab Results', className: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
      prescription: { label: 'Prescription', className: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
      imaging: { label: 'Imaging', className: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
      diagnosis: { label: 'Diagnosis', className: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
    };
    const { label, className } = config[type] || { label: 'Other', className: 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800' };
    return <Badge className={cn('border', className)}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
      approved: { label: 'Approved', className: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
      denied: { label: 'Denied', className: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
      active: { label: 'Active', className: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
      expired: { label: 'Expired', className: 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800' },
      revoked: { label: 'Revoked', className: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
    };
    const { label, className } = config[status] || config.pending;
    return <Badge className={cn('border', className)}>{label}</Badge>;
  };

  // Dashboard Section
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: stats.totalRecords, subtext: `+${stats.recordsThisMonth} this month`, icon: FileIcon, gradient: 'from-blue-500/90 to-blue-600/90' },
          { label: 'Authorized Users', value: stats.authorizedUsers, subtext: 'Active permissions', icon: UserCheckIcon, gradient: 'from-green-500/90 to-green-600/90' },
          { label: 'Pending Requests', value: stats.pendingRequests, subtext: 'Awaiting review', icon: ClockIcon, gradient: 'from-amber-500/90 to-amber-600/90' },
          { label: 'Recent Activity', value: stats.recentActivity, subtext: 'Last 30 days', icon: ActivityIcon, gradient: 'from-purple-500/90 to-purple-600/90' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-foreground mt-2">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                </div>
                <div className={cn('p-3 bg-gradient-to-br rounded-xl shadow-lg', stat.gradient)}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity and Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/30 dark:border-border/30">
            <div>
              <CardTitle className="flex items-center gap-2"><ActivityIcon className="w-5 h-5 text-primary" />Recent Activity</CardTitle>
              <CardDescription>Latest actions on your records</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('audit')} className="text-primary">View All →</Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-muted/30 backdrop-blur-sm border border-white/40 dark:border-border/40 rounded-lg hover:bg-white/70 dark:hover:bg-muted/50 transition-all">
                  <div className={cn('p-2 rounded-lg shadow-sm', log.type === 'upload' && 'bg-gradient-to-br from-blue-500/90 to-blue-600/90', log.type === 'access' && 'bg-gradient-to-br from-green-500/90 to-green-600/90', log.type === 'permission' && 'bg-gradient-to-br from-purple-500/90 to-purple-600/90')}>
                    {log.type === 'upload' && <UploadIcon className="w-4 h-4 text-white" />}
                    {log.type === 'access' && <EyeIcon className="w-4 h-4 text-white" />}
                    {log.type === 'permission' && <KeyIcon className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{log.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{log.performedBy} • {getRelativeTime(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/30 dark:border-border/30">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BellIcon className="w-5 h-5 text-primary" />Access Requests
                {stats.pendingRequests > 0 && <Badge className="ml-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">{stats.pendingRequests}</Badge>}
              </CardTitle>
              <CardDescription>Review pending requests</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('access')} className="text-primary">View All →</Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {accessRequests.filter(r => r.status === 'pending').slice(0, 2).map((req) => (
                <div key={req.id} className="p-4 bg-white/60 dark:bg-card/60 backdrop-blur-sm border-2 border-white/40 dark:border-border/40 rounded-xl hover:border-primary/50 transition-all shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName)}&background=f59e0b&color=000`} alt={req.requesterName} className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{req.requesterName}</p>
                      <p className="text-sm text-muted-foreground">{req.requesterSpecialty}</p>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-sm text-foreground/80 mb-3">{req.reason}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg" onClick={() => toast.success(`Approved ${req.requesterName}`)}>
                      <CheckCircle2Icon className="w-4 h-4 mr-1" />Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600" onClick={() => toast.error(`Denied ${req.requesterName}`)}>
                      <XCircleIcon className="w-4 h-4 mr-1" />Deny
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
        <CardHeader className="border-b border-white/30 dark:border-border/30">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => setActiveSection('upload')} className="h-auto py-6 flex flex-col gap-2 bg-gradient-to-br from-blue-500/90 to-blue-600/90 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
              <CloudUploadIcon className="w-8 h-8" />
              <span className="font-semibold">Upload New Record</span>
            </Button>
            <Button onClick={() => setActiveSection('records')} variant="outline" className="h-auto py-6 flex flex-col gap-2 hover:bg-white/60 dark:hover:bg-muted/40">
              <FileTextIcon className="w-8 h-8" />
              <span className="font-semibold">View My Records</span>
            </Button>
            <Button onClick={() => setActiveSection('permissions')} variant="outline" className="h-auto py-6 flex flex-col gap-2 hover:bg-white/60 dark:hover:bg-muted/40">
              <KeyIcon className="w-8 h-8" />
              <span className="font-semibold">Manage Permissions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Profile Section
  const renderProfile = () => (
    <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b-2 border-white/30 dark:border-border/30">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl"><UserIcon className="w-6 h-6 text-primary" />My Profile</CardTitle>
          <CardDescription>Manage your personal and medical information</CardDescription>
        </div>
        {!isEditingProfile && (
          <Button onClick={() => setIsEditingProfile(true)} className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
            <EditIcon className="w-4 h-4 mr-2" />Edit Profile
          </Button>
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
                <Input id="fullName" defaultValue={currentUser.fullName} disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={currentUser.email} disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue={currentUser.phone} disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" defaultValue={currentUser.dateOfBirth} disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" rows={3} defaultValue={currentUser.address} disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40 resize-none" />
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select disabled={!isEditingProfile} defaultValue={currentUser.bloodGroup}>
                  <SelectTrigger className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select disabled={!isEditingProfile} defaultValue={currentUser.gender}>
                  <SelectTrigger className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40">
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
            <div className="p-4 bg-gradient-to-br from-primary/20 to-amber-600/20 border-2 border-primary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Blockchain Address</span>
              </div>
              <p className="text-sm font-mono text-muted-foreground">{currentUser.blockchainAddress}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 dark:bg-muted/30 backdrop-blur-sm border border-white/40 dark:border-border/40 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Network</p>
                <p className="font-semibold text-foreground">Ganache (Local)</p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-muted/30 backdrop-blur-sm border border-white/40 dark:border-border/40 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Encryption</p>
                <p className="font-semibold text-foreground">AES-128</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isEditingProfile && (
          <div className="flex gap-3 pt-6 border-t border-white/30 dark:border-border/30">
            <Button onClick={() => { setIsEditingProfile(false); toast.success('Profile updated!'); }} className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
              <SaveIcon className="w-4 h-4 mr-2" />Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              <XIcon className="w-4 h-4 mr-2" />Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Medical Records Section
  const renderRecords = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl"><FileTextIcon className="w-6 h-6 text-primary" />Medical Records</CardTitle>
              <CardDescription>View and manage your encrypted records</CardDescription>
            </div>
            <Button onClick={() => setActiveSection('upload')} className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
              <UploadIcon className="w-4 h-4 mr-2" />Upload New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48 bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40">
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicalRecords.map((record) => (
          <Card key={record.id} className="bg-white/60 dark:bg-card/60 backdrop-blur-sm border-2 border-white/40 dark:border-border/40 hover:shadow-xl hover:border-primary/50 transition-all group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2.5 bg-gradient-to-br from-blue-500/90 to-blue-600/90 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                  <FileIcon className="w-6 h-6 text-white" />
                </div>
                {getRecordTypeBadge(record.type)}
              </div>
              <CardTitle className="text-lg line-clamp-2">{record.title}</CardTitle>
              <CardDescription className="line-clamp-2">{record.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><CalendarIcon className="w-3 h-3" /><span>{formatDate(record.uploadedAt)}</span></div>
                <div className="flex items-center gap-2"><UserIcon className="w-3 h-3" /><span>By: {record.uploadedBy}</span></div>
                <div className="flex items-center gap-2"><FileIcon className="w-3 h-3" /><span>{record.fileSize}</span></div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <ShieldCheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">AES-128 Encrypted</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 hover:bg-white/60 dark:hover:bg-muted/40"><EyeIcon className="w-4 h-4 mr-1" />View</Button>
                <Button size="sm" variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600"><DownloadIcon className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600"><TrashIcon className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Upload Section
  const renderUpload = () => (
    <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl max-w-3xl mx-auto">
      <CardHeader className="border-b border-white/30 dark:border-border/30">
        <CardTitle className="flex items-center gap-2 text-xl"><CloudUploadIcon className="w-6 h-6 text-primary" />Upload Medical Record</CardTitle>
        <CardDescription>Securely upload and encrypt your records on blockchain</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success('Record uploaded!'); }}>
          <div className="space-y-2">
            <Label htmlFor="recordTitle">Record Title *</Label>
            <Input id="recordTitle" placeholder="e.g., Blood Test - Jan 2026" required className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="recordType">Record Type *</Label>
              <Select>
                <SelectTrigger className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40">
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
              <Input id="recordDate" type="date" required className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} placeholder="Details..." className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40 resize-none" />
          </div>
          <div className="space-y-2">
            <Label>Upload File *</Label>
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-white/50 dark:bg-muted/30 backdrop-blur-sm hover:border-primary/60 transition-colors cursor-pointer">
              <CloudUploadIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PDF, PNG, JPG (Max 10MB)</p>
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Encryption & Privacy</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">AES-128 encryption before IPFS storage and blockchain recording</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
              <CloudUploadIcon className="w-4 h-4 mr-2" />Upload & Encrypt
            </Button>
            <Button type="button" variant="outline" onClick={() => setActiveSection('records')}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  // Access Requests Section
  const renderAccessRequests = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BellIcon className="w-6 h-6 text-primary" />Access Requests
            {stats.pendingRequests > 0 && <Badge className="ml-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">{stats.pendingRequests} Pending</Badge>}
          </CardTitle>
          <CardDescription>Review access requests from healthcare professionals</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({accessRequests.filter(r => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({accessRequests.filter(r => r.status === 'approved').length})</TabsTrigger>
          <TabsTrigger value="denied">Denied (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {accessRequests.filter(r => r.status === 'pending').map((req) => (
            <Card key={req.id} className="bg-white/60 dark:bg-card/60 backdrop-blur-sm border-2 border-white/40 dark:border-border/40 hover:shadow-xl hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName)}&background=f59e0b&color=000`} alt={req.requesterName} className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-700 shadow-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{req.requesterName}</h3>
                    <p className="text-sm text-muted-foreground">{req.requesterSpecialty}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{req.requesterAddress}</p>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
                <div className="space-y-3 mb-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Reason</Label>
                    <p className="text-sm text-foreground mt-1">{req.reason}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><Label className="text-xs text-muted-foreground">Duration</Label><p className="text-foreground mt-1">{req.duration}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Requested</Label><p className="text-foreground mt-1">{getRelativeTime(req.requestedAt)}</p></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg" onClick={() => toast.success(`Approved ${req.requesterName}`)}>
                    <CheckCircle2Icon className="w-4 h-4 mr-2" />Approve
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600" onClick={() => toast.error(`Denied ${req.requesterName}`)}>
                    <XCircleIcon className="w-4 h-4 mr-2" />Deny
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          {accessRequests.filter(r => r.status === 'approved').map((req) => (
            <Card key={req.id} className="bg-white/60 dark:bg-card/60 backdrop-blur-sm border-2 border-white/40 dark:border-border/40">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName)}&background=f59e0b&color=000`} alt={req.requesterName} className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-lg" />
                    <div>
                      <h3 className="font-semibold text-foreground">{req.requesterName}</h3>
                      <p className="text-sm text-muted-foreground">{req.requesterSpecialty}</p>
                      <p className="text-xs text-muted-foreground mt-1">Approved {getRelativeTime(req.requestedAt)}</p>
                    </div>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="denied" className="mt-6">
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30">
            <CardContent className="text-center py-12">
              <p className="text-sm text-muted-foreground">No denied requests</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Permissions Section
  const renderPermissions = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl"><KeyIcon className="w-6 h-6 text-primary" />Permissions Management</CardTitle>
              <CardDescription>Control who can access your medical records</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UsersIcon className="w-4 h-4" />
              <span>{stats.authorizedUsers} Active Permissions</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Granted</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((perm) => (
              <TableRow key={perm.id} className="hover:bg-white/50 dark:hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(perm.userName)}&background=f59e0b&color=000`} alt={perm.userName} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-lg" />
                    <div>
                      <p className="font-medium">{perm.userName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{perm.userAddress}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{perm.userRole}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(perm.grantedAt)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(perm.expiresAt)}</TableCell>
                <TableCell><div className="flex items-center gap-2"><ActivityIcon className="w-4 h-4 text-muted-foreground" /><span className="font-medium">{perm.accessCount}</span></div></TableCell>
                <TableCell>{getStatusBadge(perm.status)}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600" onClick={() => toast.info(`Revoked ${perm.userName}`)}>
                    <LockIcon className="w-4 h-4 mr-1" />Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  // Audit Log Section
  const renderAuditLog = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><HistoryIcon className="w-6 h-6 text-primary" />Audit Log</CardTitle>
          <CardDescription>Complete history of all activities on your records</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-white/50 dark:hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg shadow-sm', log.type === 'upload' && 'bg-gradient-to-br from-blue-500/90 to-blue-600/90', log.type === 'access' && 'bg-gradient-to-br from-green-500/90 to-green-600/90', log.type === 'permission' && 'bg-gradient-to-br from-purple-500/90 to-purple-600/90')}>
                      {log.type === 'upload' && <UploadIcon className="w-4 h-4 text-white" />}
                      {log.type === 'access' && <EyeIcon className="w-4 h-4 text-white" />}
                      {log.type === 'permission' && <KeyIcon className="w-4 h-4 text-white" />}
                    </div>
                    <span className="font-medium">{log.action}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{log.performedBy}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDateTime(log.timestamp)}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-md truncate">{log.details}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="font-mono text-xs">
                    <FileCheckIcon className="w-3 h-3 mr-1" />{log.txHash}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'profile': return renderProfile();
      case 'records': return renderRecords();
      case 'upload': return renderUpload();
      case 'access': return renderAccessRequests();
      case 'permissions': return renderPermissions();
      case 'audit': return renderAuditLog();
      default: return renderDashboard();
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
