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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HomeIcon,
  UserIcon,
  UsersIcon,
  UserPlusIcon,
  FileTextIcon,
  FileIcon,
  ClockIcon,
  ActivityIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  EyeIcon,
  StethoscopeIcon,
  IdCardIcon,
  SearchIcon,
} from 'lucide-react';

const DoctorDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');

  // Mock data
  const stats = {
    authorizedPatients: 8,
    recordsAccessed: 24,
    pendingRequests: 3,
    recentActivity: 15,
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
      id: 'patients',
      label: 'My Patients',
      icon: <UsersIcon className="w-5 h-5" />,
      section: 'patients',
    },
    {
      id: 'request',
      label: 'Request Access',
      icon: <UserPlusIcon className="w-5 h-5" />,
      section: 'request',
    },
    {
      id: 'records',
      label: 'Patient Records',
      icon: <FileTextIcon className="w-5 h-5" />,
      section: 'records',
    },
  ];

  // Dashboard Section
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl hover:shadow-2xl hover:bg-white/90 dark:hover:bg-card/90 transition-all duration-300 hover:-translate-y-1">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-gradient-to-br from-blue-500/90 to-blue-600/90 rounded-xl shadow-lg">
              <UsersIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground">{stats.authorizedPatients}</h3>
              <p className="text-sm text-muted-foreground font-medium">Authorized Patients</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl hover:shadow-2xl hover:bg-white/90 dark:hover:bg-card/90 transition-all duration-300 hover:-translate-y-1">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-gradient-to-br from-green-500/90 to-green-600/90 rounded-xl shadow-lg">
              <FileIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground">{stats.recordsAccessed}</h3>
              <p className="text-sm text-muted-foreground font-medium">Records Accessed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl hover:shadow-2xl hover:bg-white/90 dark:hover:bg-card/90 transition-all duration-300 hover:-translate-y-1">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-gradient-to-br from-amber-500/90 to-amber-600/90 rounded-xl shadow-lg">
              <ClockIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground">{stats.pendingRequests}</h3>
              <p className="text-sm text-muted-foreground font-medium">Pending Requests</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl hover:shadow-2xl hover:bg-white/90 dark:hover:bg-card/90 transition-all duration-300 hover:-translate-y-1">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-gradient-to-br from-purple-500/90 to-purple-600/90 rounded-xl shadow-lg">
              <ActivityIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground">{stats.recentActivity}</h3>
              <p className="text-sm text-muted-foreground font-medium">Recent Activity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & My Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-muted/30 backdrop-blur-sm border border-white/40 dark:border-border/40 rounded-lg hover:bg-white/70 dark:hover:bg-muted/50 transition-all">
                  <div className="p-2 bg-gradient-to-br from-blue-500/90 to-blue-600/90 rounded-lg shadow-sm">
                    <FileIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Accessed patient record</p>
                    <p className="text-xs text-muted-foreground">{i} hour{i > 1 ? 's' : ''} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-primary" />
              My Patients
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              onClick={() => setActiveSection('patients')}
              className="text-primary hover:text-primary/80"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/50 dark:bg-muted/30 backdrop-blur-sm border border-white/40 dark:border-border/40 rounded-lg hover:bg-white/70 dark:hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=Patient+${i}&background=f59e0b&color=000`}
                      alt={`Patient ${i}`}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-lg"
                    />
                    <div>
                      <p className="font-medium text-sm">Patient Name {i}</p>
                      <p className="text-xs text-muted-foreground">Last visit: Jan {i}, 2026</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="hover:bg-white/60 dark:hover:bg-muted/40">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Profile Section
  const renderProfile = () => (
    <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b-2 border-white/30 dark:border-border/30">
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-primary" />
          My Profile
        </CardTitle>
        {!isEditingProfile && (
          <Button onClick={() => setIsEditingProfile(true)} className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
            <EditIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="Dr. Sarah Smith" disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="doctor@test.com" disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialty" className="flex items-center gap-2">
                <StethoscopeIcon className="w-4 h-4" />
                Specialty
              </Label>
              <Select disabled={!isEditingProfile}>
                <SelectTrigger className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40">
                  <SelectValue placeholder="Cardiologist" />
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
              <Label htmlFor="licenseNumber" className="flex items-center gap-2">
                <IdCardIcon className="w-4 h-4" />
                Medical License Number
              </Label>
              <Input id="licenseNumber" defaultValue="MD-123456" disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+1234567890" disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital / Clinic</Label>
              <Input id="hospital" defaultValue="City General Hospital" disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" rows={3} defaultValue="456 Medical Center, City, State, ZIP" disabled={!isEditingProfile} className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40" />
          </div>

          {isEditingProfile && (
            <div className="flex gap-3">
              <Button type="button" onClick={() => setIsEditingProfile(false)} className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
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

  // My Patients Section
  const renderPatients = () => (
    <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-primary" />
          My Patients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 bg-white/60 dark:bg-card/60 backdrop-blur-sm border-2 border-white/40 dark:border-border/40 rounded-lg hover:shadow-md hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=Patient+${i}&background=f59e0b&color=000`}
                    alt={`Patient ${i}`}
                    className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">Patient Name {i}</h3>
                    <p className="text-sm text-muted-foreground">Last accessed: Jan {i}, 2026</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setActiveSection('records')} className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  View Records
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Request Access Section
  const renderRequest = () => (
    <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlusIcon className="w-5 h-5 text-primary" />
          Request Patient Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="patientSearch">Search Patient</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="patientSearch"
                placeholder="Enter patient email or wallet address"
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="pl-10 bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestReason">Reason for Access</Label>
            <Textarea
              id="requestReason"
              rows={4}
              placeholder="Explain why you need access to this patient's records..."
              className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessDuration">Access Duration</Label>
            <Select>
              <SelectTrigger className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
            <UserPlusIcon className="w-4 h-4 mr-2" />
            Send Access Request
          </Button>
        </form>

        {/* Pending Requests */}
        <div className="mt-8">
          <h3 className="font-semibold text-foreground mb-4">Pending Requests</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-white/50 dark:bg-muted/30 backdrop-blur-sm border border-white/40 dark:border-border/40 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Request to Patient {i}</p>
                    <p className="text-xs text-muted-foreground">Sent {i} day{i > 1 ? 's' : ''} ago</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Patient Records Section
  const renderRecords = () => (
    <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-2 border-white/30 dark:border-border/30 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="w-5 h-5 text-primary" />
          Patient Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Patient Selector */}
        <div className="mb-6">
          <Label htmlFor="selectPatient">Select Patient</Label>
          <Select>
            <SelectTrigger className="bg-white/60 dark:bg-muted/40 backdrop-blur-sm border-white/40 dark:border-border/40">
              <SelectValue placeholder="Choose a patient" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((i) => (
                <SelectItem key={i} value={`patient-${i}`}>
                  Patient Name {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-white/60 dark:bg-card/60 backdrop-blur-sm border-2 border-white/40 dark:border-border/40 rounded-lg hover:shadow-md hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/90 to-blue-600/90 rounded-lg shadow-sm">
                  <FileIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800">
                  Lab Results
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Medical Record {i}</h3>
              <p className="text-xs text-muted-foreground mb-3">Uploaded on Jan {10 + i}, 2026</p>
              <Button size="sm" variant="outline" className="w-full hover:bg-white/60 dark:hover:bg-muted/40">
                <EyeIcon className="w-4 h-4 mr-2" />
                View Record
              </Button>
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
      walletAddress="0x5678...9ABC"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default DoctorDashboard;

