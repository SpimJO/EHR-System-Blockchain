// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  statusCode: number;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'PATIENT' | 'DOCTOR' | 'STAFF';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  phoneNumber?: string;
  specialty?: string;
  licenseNumber?: string;
  department?: string;
  employeeId?: string;
  bloodGroup?: string;
}

export interface AuthResponse {
  message: string;
  statusCode: number;
  data?: {
    accessToken: string;
    user: User;
    blockchainAddress?: string;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'STAFF';
  blockchainAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// Profile Types
export interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  licenseNumber?: string;
  medicalId?: string;
  specialization?: string;
  hospitalAffiliation?: string;
  phoneNumber?: string;
  department?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffProfile {
  id: string;
  userId: string;
  designation?: string;
  employeeId?: string;
  phoneNumber?: string;
  department?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

// Medical Record Types
export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  description?: string;
  recordType: string;
  recordDate: string;
  ipfsHash: string;
  encryptedKey?: string;
  fileSize?: number;
  mimeType?: string;
  isVerified: boolean;
  uploadedAt: string;
  transactionHash?: string;
}

export interface UploadRecordRequest {
  title: string;
  description?: string;
  recordType: string;
  recordDate: string;
  file: File;
}

// Access Request Types
export interface AccessRequest {
  id: string;
  requesterAddress: string;
  requesterName?: string;
  requesterEmail?: string;
  requesterRole?: string;
  requesterSpecialty?: string;
  requesterDepartment?: string;
  patientAddress: string;
  patientId?: string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  requestedAt: string;
  respondedAt?: string;
  transactionHash?: string;
}

export interface RequestAccessRequest {
  patientId: string;
  reason: string;
}

// Permission Types
export interface Permission {
  id: string;
  patientAddress: string;
  authorizedAddress: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  grantedAt: string;
  expiresAt?: string;
  transactionHash?: string;
  status: 'active' | 'revoked';
}

// Audit Log Types
export interface AuditLogEntry {
  id: string;
  action: string;
  description: string;
  actor: string;
  actorAddress: string;
  timestamp: number;
  transactionHash: string;
  blockNumber?: number;
  etherscanUrl?: string;
  metadata?: Record<string, any>;
}

export interface AuditLogResponse {
  total: number;
  entries: AuditLogEntry[];
}

// Dashboard Types
export interface PatientDashboard {
  cards: {
    totalRecords: number;
    authorizedUsers: number;
    pendingRequests: number;
  };
  recentActivities: AuditLogEntry[];
  pendingAccessRequests: AccessRequest[];
}

export interface DoctorDashboard {
  cards: {
    totalPatients: number;
    pendingRequests: number;
    recordsAccessed: number;
  };
  myPatients: AuthorizedPatient[];
  recentActivity: AuditLogEntry[];
}

export interface AuthorizedPatient {
  patientAddress: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  recordCount: number;
  grantedAt: number;
  lastAccessed?: number;
  transactionHash?: string;
}

// Error Response
export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}
