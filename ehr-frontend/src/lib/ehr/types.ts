export type UserRole = 'patient' | 'doctor' | 'staff';

export type AuthMethod = 'traditional' | 'metamask';

export interface EhrSession {
  isLoggedIn: true;
  userRole: UserRole;
  userEmail: string;
  userName: string;
  authMethod: AuthMethod;
  walletAddress?: string;
  chainId?: string;
  loginTimestamp: number;
}

export interface EhrUserBase {
  id: number;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  authMethod?: AuthMethod;
  ethereumAddress?: string;
  signature?: string;
}

export interface EhrUserDoctor extends EhrUserBase {
  role: 'doctor';
  specialty: string;
  licenseNumber: string;
}

export interface EhrUserStaff extends EhrUserBase {
  role: 'staff';
  department: string;
  employeeId: string;
}

export interface EhrUserPatient extends EhrUserBase {
  role: 'patient';
  dateOfBirth: string;
  bloodGroup?: string;
  gender?: string;
  address?: string;
}

export type EhrUser = EhrUserDoctor | EhrUserStaff | EhrUserPatient;

export type StoredPassword =
  | { type: 'plain'; value: string }
  | { type: 'pbkdf2_sha256'; value: string };


