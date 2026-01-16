import { useState } from 'react';
import DashboardLayout from '@/components/app/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  LockIcon,
  CloudUploadIcon,
  CheckCircle2Icon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  DownloadIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  getCurrentUser,
  getRecordsByPatient,
  getRequestsByPatient,
  getPermissionsByPatient,
  getAuditLogsByUser,
  getPendingRequestsCount,
  getActivePermissionsCount,
  type AccessRequest,
  type Permission,
} from '@/lib/data/mockData';

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Get current patient data
  const currentUser = getCurrentUser('patient');
  const medicalRecords = getRecordsByPatient(currentUser.id);
  const accessRequests = getRequestsByPatient(currentUser.id);
  const permissions = getPermissionsByPatient(currentUser.id);
  const auditLogs = getAuditLogsByUser(currentUser.id);

  // Stats
  const stats = {
    totalRecords: medicalRecords.length,
    authorizedUsers: getActivePermissionsCount(currentUser.id),
    pendingRequests: getPendingRequestsCount(currentUser.id),
    recentActivity: auditLogs.length,
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      section: 'dashboard',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <UserIcon className="w-5 h-5" />,
      section: 'profile',
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
      id: 'requests',
      label: 'Access Requests',
      icon: <BellIcon className="w-5 h-5" />,
      badge: stats.pendingRequests,
      section: 'requests',
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
  ];

  const getSectionTitle = () => {
    const item = navItems.find((nav) => nav.section === activeSection);
    return item?.label || 'Dashboard';
  };

  const getRecordTypeColor = (type: string) => {
    const colors = {
      lab: 'bg-blue-100 text-blue-700 border-blue-200',
      prescription: 'bg-green-100 text-green-700 border-green-200',
      imaging: 'bg-purple-100 text-purple-700 border-purple-200',
      diagnosis: 'bg-orange-100 text-orange-700 border-orange-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-700 border-orange-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      denied: 'bg-red-100 text-red-700 border-red-200',
      active: 'bg-green-100 text-green-700 border-green-200',
      expired: 'bg-gray-100 text-gray-700 border-gray-200',
      revoked: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const handleApproveRequest = (request: AccessRequest) => {
    toast.success(`Approved access request from ${request.requesterName}`);
  };

  const handleDenyRequest = (request: AccessRequest) => {
    toast.error(`Denied access request from ${request.requesterName}`);
  };

  const handleRevokePermission = (permission: Permission) => {
    toast.info(`Revoked access permission for ${permission.userName}`);
  };

  // Dashboard Section
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalRecords}</h3>
              <p className="text-sm text-gray-500 font-medium">Total Records</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <UserCheckIcon className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.authorizedUsers}</h3>
              <p className="text-sm text-gray-500 font-medium">Authorized Users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-orange-100 rounded-xl">
              <ClockIcon className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.pendingRequests}</h3>
              <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <HistoryIcon className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.recentActivity}</h3>
              <p className="text-sm text-gray-500 font-medium">Recent Activities</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Access Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ActivityIcon className="w-5 h-5 text-gray-600" />
              Recent Activity
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection('audit')}
              className="text-ehr-blue-600 hover:text-ehr-blue-700"
            >
              View All →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={cn('p-2 rounded-lg', 
                    log.type === 'upload' ? 'bg-blue-100' :
                    log.type === 'access' ? 'bg-green-100' :
                    log.type === 'permission' ? 'bg-purple-100' :
                    'bg-orange-100'
                  )}>
                    {log.type === 'upload' && <UploadIcon className="w-4 h-4 text-blue-600" />}
                    {log.type === 'access' && <EyeIcon className="w-4 h-4 text-green-600" />}
                    {log.type === 'permission' && <KeyIcon className="w-4 h-4 text-purple-600" />}
                    {log.type === 'request' && <BellIcon className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500">{getRelativeTime(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BellIcon className="w-5 h-5 text-gray-600" />
              Access Requests
              {stats.pendingRequests > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {stats.pendingRequests}
                </span>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection('requests')}
              className="text-ehr-blue-600 hover:text-ehr-blue-700"
            >
              View All →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accessRequests
                .filter((req) => req.status === 'pending')
                .slice(0, 2)
                .map((request) => (
                  <div key={request.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-ehr-blue-300 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.requesterName)}&background=2563eb&color=fff`}
                        alt={request.requesterName}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{request.requesterName}</p>
                        <p className="text-sm text-gray-500">
                          {request.requesterSpecialty || request.requesterDepartment}
                        </p>
                      </div>
                      <span className={cn('px-2 py-1 text-xs font-semibold rounded-full border', getStatusColor(request.status))}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{request.reason}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <CalendarIcon className="w-3 h-3" />
                      <span>Duration: {request.duration}</span>
                      <span className="mx-2">•</span>
                      <span>{getRelativeTime(request.requestedAt)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveRequest(request)}
                      >
                        <CheckCircle2Icon className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        onClick={() => handleDenyRequest(request)}
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  </div>
                ))}
              {accessRequests.filter((req) => req.status === 'pending').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No pending requests</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Profile Section
  const renderProfile = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserIcon className="w-6 h-6 text-ehr-blue-600" />
            My Profile
          </CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </div>
        {!isEditingProfile && (
          <Button onClick={() => setIsEditingProfile(true)} className="bg-ehr-blue-600">
            <EditIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold">Full Name</Label>
              <Input id="fullName" defaultValue={currentUser.fullName} disabled={!isEditingProfile} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
              <Input id="email" type="email" defaultValue={currentUser.email} disabled={!isEditingProfile} className="h-11" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-semibold">Date of Birth</Label>
              <Input id="dob" type="date" defaultValue={currentUser.dateOfBirth} disabled={!isEditingProfile} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-semibold">Gender</Label>
              <Select disabled={!isEditingProfile} defaultValue={currentUser.gender}>
                <SelectTrigger className="h-11">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="text-sm font-semibold">Blood Group</Label>
              <Select disabled={!isEditingProfile} defaultValue={currentUser.bloodGroup}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue={currentUser.phone} disabled={!isEditingProfile} className="h-11" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-semibold">Address</Label>
            <Textarea id="address" rows={3} defaultValue={currentUser.address} disabled={!isEditingProfile} className="resize-none" />
          </div>

          {isEditingProfile && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  toast.success('Profile updated successfully!');
                }}
                className="bg-ehr-blue-600"
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );

  // Medical Records Section
  const renderRecords = () => (
    <Card>
      <CardHeader className="border-b">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileTextIcon className="w-6 h-6 text-ehr-blue-600" />
            Medical Records
          </CardTitle>
          <CardDescription>View and manage your medical records</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {medicalRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicalRecords.map((record) => (
              <div
                key={record.id}
                className="group p-5 border-2 border-gray-200 rounded-xl hover:border-ehr-blue-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <FileIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full border capitalize', getRecordTypeColor(record.type))}>
                    {record.type}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{record.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{record.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{formatDate(record.uploadedAt)}</span>
                  <span className="mx-1">•</span>
                  <span>{record.fileSize}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600 mb-4">
                  <ShieldCheckIcon className="w-3 h-3" />
                  <span>AES-128 Encrypted</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 hover:bg-ehr-blue-50">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="ghost" className="hover:bg-blue-50 hover:text-blue-600">
                    <DownloadIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="hover:bg-red-50 hover:text-red-600">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">No medical records yet</p>
            <p className="text-sm mb-4">Upload your first medical record to get started</p>
            <Button onClick={() => setActiveSection('upload')} className="bg-ehr-blue-600">
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Record
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Upload Record Section
  const renderUpload = () => (
    <Card>
      <CardHeader className="border-b">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UploadIcon className="w-6 h-6 text-ehr-blue-600" />
            Upload Medical Record
          </CardTitle>
          <CardDescription>Securely upload and encrypt your medical records</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success('Medical record uploaded and encrypted successfully!');
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="recordTitle" className="text-sm font-semibold">Record Title</Label>
            <Input
              id="recordTitle"
              placeholder="e.g., Blood Test Results"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recordType" className="text-sm font-semibold">Record Type</Label>
            <Select>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lab">Lab Results</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="imaging">Imaging/X-Ray</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recordDate" className="text-sm font-semibold">Record Date</Label>
            <Input id="recordDate" type="date" className="h-11" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recordDescription" className="text-sm font-semibold">Description</Label>
            <Textarea
              id="recordDescription"
              rows={4}
              placeholder="Add any additional notes..."
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recordFile" className="text-sm font-semibold">Upload File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-ehr-blue-400 hover:bg-ehr-blue-50/50 transition-all cursor-pointer">
              <CloudUploadIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC (Max 10MB)</p>
              <Input
                id="recordFile"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <LockIcon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">End-to-End Encryption</p>
              <p className="text-xs text-blue-700">
                Your file will be encrypted using AES-128 encryption before uploading to IPFS.
                Only authorized users can decrypt and view your records.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" className="bg-ehr-blue-600">
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload & Encrypt
            </Button>
            <Button type="reset" variant="outline">
              <XIcon className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  // Access Requests Section
  const renderRequests = () => (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BellIcon className="w-6 h-6 text-ehr-blue-600" />
              Access Requests
            </CardTitle>
            <CardDescription>Review and manage access requests from healthcare providers</CardDescription>
          </div>
          {stats.pendingRequests > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-sm font-semibold">
              {stats.pendingRequests} Pending
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {accessRequests.map((request) => (
            <div
              key={request.id}
              className={cn(
                'p-5 border-2 rounded-xl',
                request.status === 'pending' ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200',
              )}
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.requesterName)}&background=2563eb&color=fff`}
                  alt={request.requesterName}
                  className="w-14 h-14 rounded-full border-2 border-white shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{request.requesterName}</h3>
                      <p className="text-sm text-gray-600">
                        {request.requesterSpecialty || request.requesterDepartment}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'px-3 py-1 text-xs font-semibold rounded-full border capitalize',
                        getStatusColor(request.status),
                      )}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 bg-white p-3 rounded-lg border">
                    {request.reason}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>Duration: {request.duration}</span>
                    </div>
                    <span>•</span>
                    <span>Requested {getRelativeTime(request.requestedAt)}</span>
                  </div>
                </div>
              </div>
              {request.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveRequest(request)}
                  >
                    <CheckCircle2Icon className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    onClick={() => handleDenyRequest(request)}
                  >
                    <XCircleIcon className="w-4 h-4 mr-2" />
                    Deny Request
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Permissions Section
  const renderPermissions = () => (
    <Card>
      <CardHeader className="border-b">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <KeyIcon className="w-6 h-6 text-ehr-blue-600" />
            Access Permissions
          </CardTitle>
          <CardDescription>Manage who has access to your medical records</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className={cn(
                'p-5 border-2 rounded-xl',
                permission.status === 'active' ? 'border-green-200 bg-green-50/50' : 'border-gray-200',
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(permission.userName)}&background=10b981&color=fff`}
                    alt={permission.userName}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{permission.userName}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="capitalize">{permission.userRole}</span>
                      <span>•</span>
                      <span className="capitalize font-medium">{permission.accessLevel} Access</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>Granted {formatDate(permission.grantedAt)}</span>
                      {permission.expiresAt && (
                        <>
                          <span>•</span>
                          <span>Expires {formatDate(permission.expiresAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'px-3 py-1 text-xs font-semibold rounded-full border capitalize',
                      getStatusColor(permission.status),
                    )}
                  >
                    {permission.status}
                  </span>
                  {permission.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      onClick={() => handleRevokePermission(permission)}
                    >
                      <XIcon className="w-4 h-4 mr-1" />
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Audit Log Section
  const renderAudit = () => (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <HistoryIcon className="w-6 h-6 text-ehr-blue-600" />
              Audit Log
            </CardTitle>
            <CardDescription>Complete history of all activities on your records</CardDescription>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="access">Access Events</SelectItem>
              <SelectItem value="upload">Uploads</SelectItem>
              <SelectItem value="permission">Permissions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {auditLogs.map((log, index) => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="shrink-0 relative">
                <div
                  className={cn(
                    'p-2.5 rounded-xl',
                    log.type === 'upload' ? 'bg-blue-100' :
                    log.type === 'access' ? 'bg-green-100' :
                    log.type === 'permission' ? 'bg-purple-100' :
                    log.type === 'login' ? 'bg-cyan-100' :
                    'bg-orange-100',
                  )}
                >
                  {log.type === 'upload' && <UploadIcon className="w-4 h-4 text-blue-600" />}
                  {log.type === 'access' && <EyeIcon className="w-4 h-4 text-green-600" />}
                  {log.type === 'permission' && <KeyIcon className="w-4 h-4 text-purple-600" />}
                  {log.type === 'request' && <BellIcon className="w-4 h-4 text-orange-600" />}
                  {log.type === 'login' && <UserIcon className="w-4 h-4 text-cyan-600" />}
                </div>
                {index < auditLogs.length - 1 && (
                  <div className="absolute left-1/2 top-full h-3 w-0.5 bg-gray-200 -translate-x-1/2" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{log.action}</p>
                {log.details && (
                  <p className="text-xs text-gray-600 mt-1">{log.details}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{formatDateTime(log.timestamp)}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-lg capitalize">
                {log.type}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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
      case 'requests':
        return renderRequests();
      case 'permissions':
        return renderPermissions();
      case 'audit':
        return renderAudit();
      default:
        return renderDashboard();
    }
  };

  return (
    <DashboardLayout
      userName={currentUser.fullName}
      walletAddress={currentUser.walletAddress}
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      pageTitle={getSectionTitle()}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default PatientDashboard;
