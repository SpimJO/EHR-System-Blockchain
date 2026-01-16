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

  const getSectionTitle = () => {
    const item = navItems.find((nav) => nav.section === activeSection);
    return item?.label || 'Dashboard';
  };

  // Dashboard Section
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.authorizedPatients}</h3>
              <p className="text-sm text-gray-500">Authorized Patients</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.recordsAccessed}</h3>
              <p className="text-sm text-gray-500">Records Accessed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.pendingRequests}</h3>
              <p className="text-sm text-gray-500">Pending Requests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ActivityIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.recentActivity}</h3>
              <p className="text-sm text-gray-500">Recent Activity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & My Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Accessed patient record</p>
                    <p className="text-xs text-gray-500">{i} hour{i > 1 ? 's' : ''} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              My Patients
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              onClick={() => setActiveSection('patients')}
              className="text-ehr-blue-600"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=Patient+${i}&background=10b981&color=fff`}
                      alt={`Patient ${i}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">Patient Name {i}</p>
                      <p className="text-xs text-gray-500">Last visit: Jan {i}, 2026</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          My Profile
        </CardTitle>
        {!isEditingProfile && (
          <Button onClick={() => setIsEditingProfile(true)}>
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
              <Input id="fullName" defaultValue="Dr. Sarah Smith" disabled={!isEditingProfile} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="doctor@test.com" disabled={!isEditingProfile} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialty" className="flex items-center gap-2">
                <StethoscopeIcon className="w-4 h-4" />
                Specialty
              </Label>
              <Select disabled={!isEditingProfile}>
                <SelectTrigger>
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
              <Input id="licenseNumber" defaultValue="MD-123456" disabled={!isEditingProfile} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+1234567890" disabled={!isEditingProfile} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital / Clinic</Label>
              <Input id="hospital" defaultValue="City General Hospital" disabled={!isEditingProfile} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" rows={3} defaultValue="456 Medical Center, City, State, ZIP" disabled={!isEditingProfile} />
          </div>

          {isEditingProfile && (
            <div className="flex gap-3">
              <Button type="button" onClick={() => setIsEditingProfile(false)}>
                <SaveIcon className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsEditingProfile(false)}>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          My Patients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=Patient+${i}&background=10b981&color=fff`}
                    alt={`Patient ${i}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">Patient Name {i}</h3>
                    <p className="text-sm text-gray-500">Last accessed: Jan {i}, 2026</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setActiveSection('records')}>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlusIcon className="w-5 h-5" />
          Request Patient Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="patientSearch">Search Patient</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="patientSearch"
                placeholder="Enter patient email or wallet address"
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestReason">Reason for Access</Label>
            <Textarea
              id="requestReason"
              rows={4}
              placeholder="Explain why you need access to this patient's records..."
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
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit">
            <UserPlusIcon className="w-4 h-4 mr-2" />
            Send Access Request
          </Button>
        </form>

        {/* Pending Requests */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Pending Requests</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Request to Patient {i}</p>
                    <p className="text-xs text-gray-500">Sent {i} day{i > 1 ? 's' : ''} ago</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="w-5 h-5" />
          Patient Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Patient Selector */}
        <div className="mb-6">
          <Label htmlFor="selectPatient">Select Patient</Label>
          <Select>
            <SelectTrigger>
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
            <div key={i} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileIcon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Lab Results
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Medical Record {i}</h3>
              <p className="text-xs text-gray-500 mb-3">Uploaded on Jan {10 + i}, 2026</p>
              <Button size="sm" variant="outline" className="w-full">
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
      pageTitle={getSectionTitle()}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default DoctorDashboard;

