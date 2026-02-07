import { useState } from 'react';
import DashboardLayout from '@/components/app/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  UsersIcon,
  UserPlusIcon,
  FileTextIcon,
  SearchIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useFetchApi, useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import {
  patientsService,
  accessRequestsService,
  recordsService,
} from '@/services/api';
import { MedicalRecordCard } from '@/components/medical/MedicalRecordCard';

const DoctorDashboard = () => {
  const [activeSection, setActiveSection] = useState('patients');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [requestAccessForm, setRequestAccessForm] = useState({
    patientId: '',
    reason: '',
  });

  const { user } = useAuth();

  // Fetch my patients (authorized patients from blockchain)
  const {
    data: patientsData,
    loading: patientsLoading,
  } = useFetchApi(() => patientsService.getMyPatients(), []);

  // Fetch outgoing access requests
  const {
    data: requestsData,
    loading: requestsLoading,
    refetch: refetchRequests,
  } = useFetchApi(() => accessRequestsService.getMyOutgoingRequests(), []);

  // Fetch patient records (when patient is selected)
  const {
    data: recordsData,
    loading: recordsLoading,
  } = useFetchApi(
    () => (selectedPatientId ? recordsService.getPatientRecords(selectedPatientId) : Promise.resolve(null)),
    [selectedPatientId]
  );

  // API mutations
  const requestAccessApi = useApi(accessRequestsService.requestAccess);

  const patients = patientsData?.data?.patients || [];
  const records = recordsData?.data || [];
  const outgoingRequests = Array.isArray(requestsData?.data) ? requestsData.data : [];

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
      setActiveSection('patients');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to request access');
    }
  };

  const navItems = [
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
  ];

  // My Patients Section (Figure 45: Doctor's authorized patient list)
  const renderPatients = () => (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Patients</h2>
        <p className="text-muted-foreground">Patients who have granted you access to their medical records.</p>
      </div>

      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Authorized Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientsLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    <UsersIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No authorized patients found</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setActiveSection('request')}
                    >
                      Request access to a patient
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.patientId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.patientName)}&background=random`}
                          />
                          <AvatarFallback>
                            {patient.patientName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{patient.patientName}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {patient.patientAddress.substring(0, 10)}...
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {patient.recordCount} record{patient.recordCount !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {patient.lastAccessed
                        ? new Date(patient.lastAccessed * 1000).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPatientId(patient.patientId);
                          setActiveSection('records');
                        }}
                      >
                        View Records
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // Request Access Section (Figure 49: Doctor requests access)
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
          <form className="space-y-6" onSubmit={handleRequestAccess}>
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID or Email *</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
              <Label htmlFor="requestReason">Reason for Access *</Label>
              <Textarea
                id="requestReason"
                rows={4}
                placeholder="Explain why you need access to this patient's records (e.g., upcoming appointment, consultation)..."
                className="resize-none"
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
                  <UserPlusIcon className="w-4 h-4 mr-2" />
                  Send Access Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="pt-6">
        <h3 className="text-lg font-semibold mb-4">My Outgoing Requests</h3>
        {requestsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : outgoingRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No outgoing requests found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {outgoingRequests.map((req) => (
              <Card key={req.id} className="border-muted/40 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center',
                        req.status === 'PENDING'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                          : req.status === 'APPROVED'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      )}
                    >
                      {req.status === 'PENDING' && <ClockIcon className="h-5 w-5" />}
                      {req.status === 'APPROVED' && <CheckCircleIcon className="h-5 w-5" />}
                      {req.status === 'DENIED' && <XCircleIcon className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        Request to Patient
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.reason || 'Access request'}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      req.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                        : req.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
                    )}
                  >
                    {req.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Patient Records Section (View patient medical records after approval)
  const renderRecords = () => {
    const selectedPatient = patients.find((p) => p.patientId === selectedPatientId);

    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Patient Records</h2>
            {selectedPatient && (
              <p className="text-muted-foreground">
                Viewing records for {selectedPatient.patientName}
              </p>
            )}
            {!selectedPatient && (
              <p className="text-muted-foreground">
                Select a patient from "My Patients" to view their records.
              </p>
            )}
          </div>
          {selectedPatient && (
            <Button variant="outline" onClick={() => setActiveSection('patients')}>
              Back to Patients
            </Button>
          )}
        </div>

        {!selectedPatient ? (
          <Card className="border-muted/40 shadow-sm">
            <CardContent className="py-12 text-center">
              <FileTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No patient selected</p>
              <Button onClick={() => setActiveSection('patients')}>
                View My Patients
              </Button>
            </CardContent>
          </Card>
        ) : recordsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : records.length === 0 ? (
          <Card className="border-muted/40 shadow-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No medical records found for this patient</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
              <MedicalRecordCard
                key={record.id}
                record={{
                  ...record,
                  fileSize: record.fileSize ? String(record.fileSize) : undefined
                }}
                onView={() => {
                  toast.info('Viewing record: ' + record.title);
                }}
                onDownload={() => {
                  toast.info('Downloading record: ' + record.title);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'patients':
        return renderPatients();
      case 'request':
        return renderRequest();
      case 'records':
        return renderRecords();
      default:
        return renderPatients();
    }
  };

  return (
    <DashboardLayout
      userName={user?.fullName || 'Doctor'}
      walletAddress={user?.blockchainAddress || '0x...'}
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default DoctorDashboard;

