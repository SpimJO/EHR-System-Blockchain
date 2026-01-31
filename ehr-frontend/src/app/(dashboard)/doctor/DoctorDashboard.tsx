import { useState } from 'react';
import DashboardLayout from '@/components/app/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HomeIcon,
  UserIcon,
  UsersIcon,
  UserPlusIcon,
  FileTextIcon,
  ClockIcon,
  ActivityIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  EyeIcon,
  StethoscopeIcon,
  IdCardIcon,
  SearchIcon,
  MoreHorizontalIcon,
  FileIcon,
  CloudUploadIcon,
  DownloadIcon,
  TrashIcon,
  ShareIcon,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

const DoctorDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const totalRecords = 24;

  // Mock data
  const stats = {
    authorizedPatients: 8,
    recordsAccessed: 24,
    pendingRequests: 3,
    recentActivity: 15,
  };

  const recentActivities = [
    {
      id: '1',
      action: 'Accessed record',
      performedBy: 'You',
      timestamp: Date.now() / 1000 - 3600,
      details: "Viewed John Doe's lab results",
    },
    {
      id: '2',
      action: 'Granted permission',
      performedBy: 'Admin',
      timestamp: Date.now() / 1000 - 7200,
      details: 'Access granted to Jane Smith',
    },
    {
      id: '3',
      action: 'Upload record',
      performedBy: 'You',
      timestamp: Date.now() / 1000 - 86400,
      details: 'Uploaded vaccination report',
    },
    {
      id: '4',
      action: 'Request access',
      performedBy: 'You',
      timestamp: Date.now() / 1000 - 172800,
      details: 'Requested access to Robert Johnson',
    },
  ];

  const patients = [
    {
      id: 1,
      name: 'John Doe',
      lastVisit: 'Jan 12, 2024',
      condition: 'Hypertension',
      status: 'Stable',
      image: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
    },
    {
      id: 2,
      name: 'Jane Smith',
      lastVisit: 'Jan 10, 2024',
      condition: 'Diabetes T2',
      status: 'Monitor',
      image: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
    },
    {
      id: 3,
      name: 'Robert Johnson',
      lastVisit: 'Jan 05, 2024',
      condition: 'Post-op',
      status: 'Recovering',
      image: 'https://ui-avatars.com/api/?name=Robert+Johnson&background=random',
    },
    {
      id: 4,
      name: 'Emily Davis',
      lastVisit: 'Jan 02, 2024',
      condition: 'Asthma',
      status: 'Stable',
      image: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random',
    },
    {
      id: 5,
      name: 'Michael Wilson',
      lastVisit: 'Dec 28, 2023',
      condition: 'Arrhythmia',
      status: 'Critical',
      image: 'https://ui-avatars.com/api/?name=Michael+Wilson&background=random',
    },
  ];

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      section: 'dashboard',
    },
    {
      id: 'patients',
      label: 'My Patients',
      icon: <UsersIcon className="w-5 h-5" />,
      section: 'patients',
    },
    {
      id: 'records',
      label: 'Patient Records',
      icon: <FileTextIcon className="w-5 h-5" />,
      section: 'records',
    },
    {
      id: 'request',
      label: 'Request Access',
      icon: <UserPlusIcon className="w-5 h-5" />,
      section: 'request',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <UserIcon className="w-5 h-5" />,
      section: 'profile',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'stable':
        return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20';
      case 'monitor':
        return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'recovering':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  // Dashboard Section
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Authorized Patients"
          value={stats.authorizedPatients}
          icon={UsersIcon}
          description="Active authorizations"
          trend={{ value: 12, label: "vs last month", trend: 'up' }}
          variant="gradient"
        />
        <StatsCard
          title="Records Accessed"
          value={stats.recordsAccessed}
          icon={FileTextIcon}
          description="Total views this month"
          trend={{ value: 4, label: "vs last month", trend: 'up' }}
        />
        <StatsCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={ClockIcon}
          description="Awaiting approval"
          trend={{ value: 2, label: "new requests", trend: 'neutral' }}
        />
        <StatsCard
          title="Total Activity"
          value={stats.recentActivity}
          icon={ActivityIcon}
          description="Actions this week"
          trend={{ value: 5, label: "vs last week", trend: 'up' }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Patients */}
        <Card className="col-span-4 border-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>You have 3 appointments remaining today.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.slice(0, 4).map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={patient.image} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setActiveSection('patients')}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setActiveSection('records')}>
                            View records
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Update status</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="col-span-3 border-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions recorded on the blockchain.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={recentActivities as any} maxItems={5} className="pr-0" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Profile Section
  const renderProfile = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in-50 duration-500">
      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Doctor Profile</CardTitle>
            <CardDescription>Manage your professional information and settings.</CardDescription>
          </div>
          {!isEditingProfile ? (
            <Button onClick={() => setIsEditingProfile(true)}>
              <EditIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={() => setIsEditingProfile(false)}>
                <SaveIcon className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage
                    src="https://ui-avatars.com/api/?name=Sarah+Smith&background=0ea5e9&color=fff"
                    alt="Dr. Sarah Smith"
                  />
                  <AvatarFallback className="text-4xl">SS</AvatarFallback>
                </Avatar>
                {isEditingProfile && (
                  <Button variant="outline" size="sm" className="w-full">
                    Change Photo
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      defaultValue="Dr. Sarah Smith"
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="doctor@test.com"
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select disabled={!isEditingProfile} defaultValue="Cardiologist">
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                        <SelectItem value="Neurologist">Neurologist</SelectItem>
                        <SelectItem value="General Physician">General Physician</SelectItem>
                        <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                        <SelectItem value="Surgeon">Surgeon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      defaultValue="MD-123456"
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+1234567890"
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital / Clinic</Label>
                    <Input
                      id="hospital"
                      defaultValue="City General Hospital"
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Office Address</Label>
                  <Textarea
                    id="address"
                    className="min-h-[80px]"
                    defaultValue="456 Medical Center, Suite 200, Metro City, ST 12345"
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  // My Patients Section
  const renderPatients = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Patients</h2>
          <p className="text-muted-foreground">Manage your patient list and authorizations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export List</Button>
          <Button>
            <UserPlusIcon className="mr-2 h-4 w-4" /> Add Patient
          </Button>
        </div>
      </div>

      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Patient List</CardTitle>
            <div className="relative w-64">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={patient.image} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{patient.name}</span>
                        <span className="text-xs text-muted-foreground">ID: #{1000 + patient.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                       <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            {<Icons.Phone className="h-4 w-4" />}
                       </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            {<Icons.Mail className="h-4 w-4" />}
                       </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setActiveSection('records')}>
                      View Records
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

  // Request Access Section
  const renderRequest = () => (
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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patientSearch">Search Patient</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="patientSearch"
                  placeholder="Enter patient email, wallet address, or ID"
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestReason">Reason for Access</Label>
              <Textarea
                id="requestReason"
                rows={4}
                placeholder="Explain why you need access to this patient's records (e.g., upcoming appointment, consultation)..."
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessDuration">Access Duration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                  <SelectItem value="unlimited">Unlimited (Emergency)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Send Access Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-muted/40 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Request to Patient {i}</p>
                    <p className="text-xs text-muted-foreground">Sent {i} day{i > 1 ? 's' : ''} ago</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                  Pending Approval
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Patient Records Section
  const renderRecords = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Patient Records</h2>
          <p className="text-muted-foreground">View and manage patient medical history and files.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
                <CloudUploadIcon className="w-4 h-4" /> Upload Record
            </Button>
            <Button className="gap-2">
                <UserPlusIcon className="w-4 h-4" /> Request Access
            </Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm bg-card">
        <CardHeader>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search records by name, type, or date..." 
                        className="pl-9 bg-muted/30 border-input focus:bg-background transition-colors"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Record Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="lab">Lab Results</SelectItem>
                            <SelectItem value="prescription">Prescriptions</SelectItem>
                            <SelectItem value="imaging">Imaging (X-Ray/MRI)</SelectItem>
                            <SelectItem value="vaccination">Vaccination</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="newest">
                         <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="patient">Patient Name</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Record Name</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {[
                { id: 1, title: 'Blood Work Analysis', patient: 'John Doe', type: 'Lab Results', date: 'Jan 12, 2024', size: '2.4 MB', icon: FileTextIcon, color: 'text-blue-500 bg-blue-500/10' },
                { id: 2, title: 'Chest X-Ray', patient: 'Jane Smith', type: 'Imaging', date: 'Jan 10, 2024', size: '15.8 MB', icon: FileIcon, color: 'text-purple-500 bg-purple-500/10' },
                { id: 3, title: 'Annual Checkup Summary', patient: 'Robert Johnson', type: 'Summary', date: 'Jan 05, 2024', size: '1.2 MB', icon: FileTextIcon, color: 'text-green-500 bg-green-500/10' },
                { id: 4, title: 'Covid-19 Vaccination', patient: 'Emily Davis', type: 'Vaccination', date: 'Dec 15, 2023', size: '540 KB', icon: ActivityIcon, color: 'text-amber-500 bg-amber-500/10' },
                { id: 5, title: 'MRI Scan - Brain', patient: 'Michael Wilson', type: 'Imaging', date: 'Dec 10, 2023', size: '45.2 MB', icon: FileIcon, color: 'text-purple-500 bg-purple-500/10' },
            ].map((record) => (
              <TableRow key={record.id} className="group hover:bg-muted/30 cursor-pointer transition-colors">
                <TableCell>
                    <div className={cn("p-2 rounded-lg w-fit", record.color)}>
                        <record.icon className="w-4 h-4" />
                    </div>
                </TableCell>
                <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span className="text-foreground group-hover:text-primary transition-colors">{record.title}</span>
                        <span className="text-xs text-muted-foreground md:hidden">{record.patient}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{record.patient.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">{record.patient}</span>
                    </div>
                </TableCell>
                <TableCell>
                     <Badge variant="outline" className="font-normal border-border/50">
                        {record.type}
                     </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{record.date}</TableCell>
                <TableCell className="text-muted-foreground text-xs font-mono">{record.size}</TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer">
                          <EyeIcon className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <ShareIcon className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
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
              Showing {(currentPage - 1) * recordsPerPage + 1}-{Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} records
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

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfile();
      case 'patients':
        return renderPatients();
      case 'request':
        return renderRequest();
      case 'records':
        return renderRecords();
      default:
        return renderDashboard();
    }
  };

  return (
    <DashboardLayout
      userName="Dr. Sarah Smith"
      walletAddress="0x71C...9A21"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

// Start of local Icons object to avoid import errors if lucid-react exports change or are missing
const Icons = {
    Phone: (props: any) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    ),
    Mail: (props: any) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}

export default DoctorDashboard;

