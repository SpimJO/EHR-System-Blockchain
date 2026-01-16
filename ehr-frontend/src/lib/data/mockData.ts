// Mock Data for EHR System
// This provides realistic static data for all dashboards

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'doctor' | 'staff';
  walletAddress: string;
  avatar?: string;
  phone: string;
  createdAt: string;
  // Role-specific fields
  specialty?: string; // Doctor
  licenseNumber?: string; // Doctor
  department?: string; // Staff
  employeeId?: string; // Staff
  dateOfBirth?: string; // Patient
  bloodGroup?: string; // Patient
  gender?: string; // Patient
  address?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  type: 'lab' | 'prescription' | 'imaging' | 'diagnosis' | 'other';
  description: string;
  date: string;
  uploadedAt: string;
  ipfsHash: string;
  fileSize: string;
  encrypted: boolean;
}

export interface AccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: 'doctor' | 'staff';
  requesterSpecialty?: string;
  requesterDepartment?: string;
  patientId: string;
  patientName: string;
  reason: string;
  duration: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  respondedAt?: string;
}

export interface Permission {
  id: string;
  userId: string;
  userName: string;
  userRole: 'doctor' | 'staff';
  patientId: string;
  patientName: string;
  accessLevel: 'read' | 'full';
  grantedAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface AuditLog {
  id: string;
  type: 'access' | 'upload' | 'permission' | 'request' | 'login';
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'patient-1',
    email: 'john.doe@patient.com',
    fullName: 'John Doe',
    role: 'patient',
    walletAddress: '0x1234...5678',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    bloodGroup: 'O+',
    gender: 'male',
    address: '123 Main Street, New York, NY 10001',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'patient-2',
    email: 'jane.smith@patient.com',
    fullName: 'Jane Smith',
    role: 'patient',
    walletAddress: '0x2345...6789',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1985-08-22',
    bloodGroup: 'A+',
    gender: 'female',
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    createdAt: '2024-02-10T14:20:00Z',
  },
  {
    id: 'doctor-1',
    email: 'sarah.johnson@doctor.com',
    fullName: 'Dr. Sarah Johnson',
    role: 'doctor',
    walletAddress: '0x5678...9ABC',
    phone: '+1 (555) 345-6789',
    specialty: 'Cardiologist',
    licenseNumber: 'MD-123456',
    address: '789 Medical Center, Boston, MA 02101',
    createdAt: '2023-11-20T09:15:00Z',
  },
  {
    id: 'doctor-2',
    email: 'michael.chen@doctor.com',
    fullName: 'Dr. Michael Chen',
    role: 'doctor',
    walletAddress: '0x6789...ABCD',
    phone: '+1 (555) 456-7890',
    specialty: 'Neurologist',
    licenseNumber: 'MD-234567',
    address: '321 Healthcare Blvd, Chicago, IL 60601',
    createdAt: '2023-10-05T11:30:00Z',
  },
  {
    id: 'staff-1',
    email: 'emily.davis@staff.com',
    fullName: 'Emily Davis',
    role: 'staff',
    walletAddress: '0x9ABC...DEF0',
    phone: '+1 (555) 567-8901',
    department: 'Nursing',
    employeeId: 'EMP-789012',
    address: '654 Hospital Way, Seattle, WA 98101',
    createdAt: '2024-03-01T08:45:00Z',
  },
];

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec-1',
    patientId: 'patient-1',
    patientName: 'John Doe',
    title: 'Blood Test Results',
    type: 'lab',
    description: 'Complete blood count and lipid panel results',
    date: '2026-01-10',
    uploadedAt: '2026-01-10T14:30:00Z',
    ipfsHash: 'QmX4e5Y6z7A8b9C0d1E2f3G4h5I6j7K8l9M0n1O2p3Q4r5',
    fileSize: '2.4 MB',
    encrypted: true,
  },
  {
    id: 'rec-2',
    patientId: 'patient-1',
    patientName: 'John Doe',
    title: 'Cardiology Consultation',
    type: 'diagnosis',
    description: 'Annual cardiac checkup and ECG results',
    date: '2026-01-05',
    uploadedAt: '2026-01-05T16:20:00Z',
    ipfsHash: 'QmY5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6',
    fileSize: '1.8 MB',
    encrypted: true,
  },
  {
    id: 'rec-3',
    patientId: 'patient-1',
    patientName: 'John Doe',
    title: 'Chest X-Ray',
    type: 'imaging',
    description: 'Routine chest X-ray examination',
    date: '2025-12-20',
    uploadedAt: '2025-12-20T11:15:00Z',
    ipfsHash: 'QmZ6g7H8i9J0k1L2m3N4o5P6q7R8s9T0u1V2w3X4y5Z6a7',
    fileSize: '4.2 MB',
    encrypted: true,
  },
  {
    id: 'rec-4',
    patientId: 'patient-1',
    patientName: 'John Doe',
    title: 'Prescription - Antibiotics',
    type: 'prescription',
    description: 'Amoxicillin 500mg - 7 days course',
    date: '2025-12-15',
    uploadedAt: '2025-12-15T09:30:00Z',
    ipfsHash: 'QmA7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A7b8',
    fileSize: '512 KB',
    encrypted: true,
  },
  {
    id: 'rec-5',
    patientId: 'patient-1',
    patientName: 'John Doe',
    title: 'MRI Scan - Brain',
    type: 'imaging',
    description: 'Brain MRI scan for headache diagnosis',
    date: '2025-11-28',
    uploadedAt: '2025-11-28T13:45:00Z',
    ipfsHash: 'QmB8i9J0k1L2m3N4o5P6q7R8s9T0u1V2w3X4y5Z6a7B8c9',
    fileSize: '8.7 MB',
    encrypted: true,
  },
];

// Mock Access Requests
export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'req-1',
    requesterId: 'doctor-1',
    requesterName: 'Dr. Sarah Johnson',
    requesterRole: 'doctor',
    requesterSpecialty: 'Cardiologist',
    patientId: 'patient-1',
    patientName: 'John Doe',
    reason: 'Annual cardiac checkup and follow-up consultation needed',
    duration: '30 days',
    status: 'pending',
    requestedAt: '2026-01-13T10:30:00Z',
  },
  {
    id: 'req-2',
    requesterId: 'doctor-2',
    requesterName: 'Dr. Michael Chen',
    requesterRole: 'doctor',
    requesterSpecialty: 'Neurologist',
    patientId: 'patient-1',
    patientName: 'John Doe',
    reason: 'Neurological assessment for chronic headaches',
    duration: '60 days',
    status: 'pending',
    requestedAt: '2026-01-12T14:15:00Z',
  },
  {
    id: 'req-3',
    requesterId: 'staff-1',
    requesterName: 'Emily Davis',
    requesterRole: 'staff',
    requesterDepartment: 'Nursing',
    patientId: 'patient-1',
    patientName: 'John Doe',
    reason: 'Pre-operative preparation and patient care coordination',
    duration: '7 days',
    status: 'approved',
    requestedAt: '2026-01-10T09:00:00Z',
    respondedAt: '2026-01-10T11:30:00Z',
  },
  {
    id: 'req-4',
    requesterId: 'doctor-1',
    requesterName: 'Dr. Sarah Johnson',
    requesterRole: 'doctor',
    requesterSpecialty: 'Cardiologist',
    patientId: 'patient-2',
    patientName: 'Jane Smith',
    reason: 'Emergency consultation for chest pain',
    duration: '90 days',
    status: 'approved',
    requestedAt: '2026-01-08T16:45:00Z',
    respondedAt: '2026-01-08T17:00:00Z',
  },
];

// Mock Permissions
export const mockPermissions: Permission[] = [
  {
    id: 'perm-1',
    userId: 'doctor-1',
    userName: 'Dr. Sarah Johnson',
    userRole: 'doctor',
    patientId: 'patient-1',
    patientName: 'John Doe',
    accessLevel: 'full',
    grantedAt: '2025-12-15T10:00:00Z',
    expiresAt: '2026-02-15T10:00:00Z',
    status: 'active',
  },
  {
    id: 'perm-2',
    userId: 'staff-1',
    userName: 'Emily Davis',
    userRole: 'staff',
    patientId: 'patient-1',
    patientName: 'John Doe',
    accessLevel: 'read',
    grantedAt: '2026-01-10T11:30:00Z',
    expiresAt: '2026-01-17T11:30:00Z',
    status: 'active',
  },
  {
    id: 'perm-3',
    userId: 'doctor-2',
    userName: 'Dr. Michael Chen',
    userRole: 'doctor',
    patientId: 'patient-2',
    patientName: 'Jane Smith',
    accessLevel: 'full',
    grantedAt: '2025-11-20T09:00:00Z',
    expiresAt: '2026-01-20T09:00:00Z',
    status: 'expired',
  },
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    type: 'access',
    action: 'Record accessed by Dr. Sarah Johnson',
    userId: 'doctor-1',
    userName: 'Dr. Sarah Johnson',
    userRole: 'doctor',
    timestamp: '2026-01-14T14:30:00Z',
    details: 'Accessed Blood Test Results (rec-1)',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'audit-2',
    type: 'upload',
    action: 'New medical record uploaded',
    userId: 'patient-1',
    userName: 'John Doe',
    userRole: 'patient',
    timestamp: '2026-01-10T14:30:00Z',
    details: 'Uploaded Blood Test Results',
    ipAddress: '192.168.1.50',
  },
  {
    id: 'audit-3',
    type: 'permission',
    action: 'Access permission granted to Emily Davis',
    userId: 'patient-1',
    userName: 'John Doe',
    userRole: 'patient',
    timestamp: '2026-01-10T11:30:00Z',
    details: 'Granted read access for 7 days',
    ipAddress: '192.168.1.50',
  },
  {
    id: 'audit-4',
    type: 'request',
    action: 'Access request received from Dr. Michael Chen',
    userId: 'doctor-2',
    userName: 'Dr. Michael Chen',
    userRole: 'doctor',
    timestamp: '2026-01-12T14:15:00Z',
    details: 'Requesting 60 days access',
    ipAddress: '192.168.1.120',
  },
  {
    id: 'audit-5',
    type: 'access',
    action: 'Record accessed by Emily Davis',
    userId: 'staff-1',
    userName: 'Emily Davis',
    userRole: 'staff',
    timestamp: '2026-01-11T09:15:00Z',
    details: 'Accessed Cardiology Consultation (rec-2)',
    ipAddress: '192.168.1.150',
  },
  {
    id: 'audit-6',
    type: 'login',
    action: 'User logged in successfully',
    userId: 'patient-1',
    userName: 'John Doe',
    userRole: 'patient',
    timestamp: '2026-01-14T08:00:00Z',
    details: 'Login via MetaMask',
    ipAddress: '192.168.1.50',
  },
  {
    id: 'audit-7',
    type: 'permission',
    action: 'Access permission revoked',
    userId: 'patient-1',
    userName: 'John Doe',
    userRole: 'patient',
    timestamp: '2026-01-05T16:30:00Z',
    details: 'Revoked access for Dr. Michael Chen',
    ipAddress: '192.168.1.50',
  },
  {
    id: 'audit-8',
    type: 'upload',
    action: 'Medical record updated',
    userId: 'patient-1',
    userName: 'John Doe',
    userRole: 'patient',
    timestamp: '2026-01-05T16:20:00Z',
    details: 'Updated Cardiology Consultation metadata',
    ipAddress: '192.168.1.50',
  },
];

// Helper functions
export const getCurrentUser = (role: 'patient' | 'doctor' | 'staff'): User => {
  const userMap = {
    patient: mockUsers[0],
    doctor: mockUsers[2],
    staff: mockUsers[4],
  };
  return userMap[role];
};

export const getRecordsByPatient = (patientId: string): MedicalRecord[] => {
  return mockMedicalRecords.filter((record) => record.patientId === patientId);
};

export const getRequestsByPatient = (patientId: string): AccessRequest[] => {
  return mockAccessRequests.filter((request) => request.patientId === patientId);
};

export const getPermissionsByPatient = (patientId: string): Permission[] => {
  return mockPermissions.filter((permission) => permission.patientId === patientId);
};

export const getAuditLogsByUser = (userId: string): AuditLog[] => {
  return mockAuditLogs.filter((log) => log.userId === userId);
};

export const getPendingRequestsCount = (patientId: string): number => {
  return mockAccessRequests.filter(
    (request) => request.patientId === patientId && request.status === 'pending',
  ).length;
};

export const getActivePermissionsCount = (patientId: string): number => {
  return mockPermissions.filter(
    (permission) => permission.patientId === patientId && permission.status === 'active',
  ).length;
};

// For Doctor/Staff dashboards
export const getAuthorizedPatients = (userId: string): User[] => {
  const authorizedPatientIds = mockPermissions
    .filter((perm) => perm.userId === userId && perm.status === 'active')
    .map((perm) => perm.patientId);

  return mockUsers.filter((user) => authorizedPatientIds.includes(user.id));
};

export const getRecordsAccessedCount = (userId: string): number => {
  return mockAuditLogs.filter(
    (log) => log.userId === userId && log.type === 'access',
  ).length;
};

