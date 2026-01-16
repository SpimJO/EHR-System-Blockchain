import { cryptoService } from './crypto';
import type { EhrSession, EhrUser, StoredPassword, UserRole } from './types';
import { readLocalStorageJson, writeLocalStorageJson } from './storage';
import { setSession } from './session';

const USERS_KEY = 'ehr_users';

type StoredUser = (EhrUser & { password: StoredPassword }) | null;

export interface LoginInput {
  role: UserRole;
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInputCommon {
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface RegisterDoctorInput extends RegisterInputCommon {
  role: 'doctor';
  specialty: string;
  licenseNumber: string;
}

export interface RegisterStaffInput extends RegisterInputCommon {
  role: 'staff';
  department: string;
  employeeId: string;
}

export interface RegisterPatientInput extends RegisterInputCommon {
  role: 'patient';
  dateOfBirth: string;
  bloodGroup?: string;
}

export type RegisterInput = RegisterDoctorInput | RegisterStaffInput | RegisterPatientInput;

function normalizeIdentifier(id: string): string {
  return id.trim().toLowerCase();
}

function isLikelyPbkdf2Base64(value: string): boolean {
  // base64 should be fairly long; for 48 bytes it is commonly 64 chars with padding.
  if (value.length < 40) return false;
  // Quick sanity check: base64 charset
  if (!/^[A-Za-z0-9+/=]+$/.test(value)) return false;
  try {
    const bytes = Uint8Array.from(window.atob(value), (c) => c.charCodeAt(0));
    return bytes.length === 48;
  } catch {
    return false;
  }
}

function matchUserIdentifier(userEmail: string, input: string): boolean {
  const u = normalizeIdentifier(userEmail);
  const i = normalizeIdentifier(input);

  if (u === i) return true;

  // Allow username form: "patient" matches "patient@test.com"
  if (!i.includes('@')) {
    const username = u.split('@')[0] ?? '';
    return username === i;
  }

  return false;
}

function readUsers(): Array<EhrUser & { password: StoredPassword }> {
  const raw = readLocalStorageJson<Array<EhrUser & { password?: StoredPassword | string }>>(USERS_KEY, []);

  // Upgrade old stored shape where password may be a string.
  return raw
    .map((u) => {
      if (!u) return null;
      const passwordRaw = (u as { password?: StoredPassword | string }).password;
      const password: StoredPassword =
        typeof passwordRaw === 'string'
          ? isLikelyPbkdf2Base64(passwordRaw)
            ? { type: 'pbkdf2_sha256', value: passwordRaw }
            : { type: 'plain', value: passwordRaw }
          : passwordRaw && typeof passwordRaw === 'object' && 'type' in passwordRaw && 'value' in passwordRaw
            ? (passwordRaw as StoredPassword)
            : { type: 'plain', value: '' };

      return {
        ...(u as EhrUser),
        password,
      };
    })
    .filter((u): u is EhrUser & { password: StoredPassword } => !!u);
}

function writeUsers(users: Array<EhrUser & { password: StoredPassword }>): void {
  writeLocalStorageJson(USERS_KEY, users);
}

function getDemoUser(role: UserRole): { email: string; password: string; fullName: string } {
  switch (role) {
    case 'patient':
      return { email: 'patient@test.com', password: 'patient123', fullName: 'Patient User' };
    case 'doctor':
      return { email: 'doctor@test.com', password: 'doctor123', fullName: 'Doctor User' };
    case 'staff':
      return { email: 'staff@test.com', password: 'staff123', fullName: 'Staff User' };
  }
}

async function verifyStoredPassword(input: string, stored: StoredPassword): Promise<boolean> {
  if (stored.type === 'plain') return input === stored.value;
  return await cryptoService.verifyPassword(input, stored.value);
}

export const ehrAuthService = {
  listUsers(): Array<EhrUser & { password: StoredPassword }> {
    return readUsers();
  },

  async register(data: RegisterInput): Promise<EhrUser> {
    const users = readUsers();

    if (users.some((u) => normalizeIdentifier(u.email) === normalizeIdentifier(data.email))) {
      throw new Error('Email already registered');
    }

    const passwordHash = await cryptoService.hashPassword(data.password);

    const baseUser = {
      id: Date.now(),
      role: data.role,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    } as const;

    const newUser: EhrUser =
      data.role === 'doctor'
        ? {
            ...baseUser,
            role: 'doctor',
            specialty: data.specialty,
            licenseNumber: data.licenseNumber,
          }
        : data.role === 'staff'
          ? {
              ...baseUser,
              role: 'staff',
              department: data.department,
              employeeId: data.employeeId,
            }
          : {
              ...baseUser,
              role: 'patient',
              dateOfBirth: data.dateOfBirth,
              bloodGroup: data.bloodGroup,
              gender: 'Not specified',
              address: '',
            };

    writeUsers([
      ...users,
      {
        ...newUser,
        password: { type: 'pbkdf2_sha256', value: passwordHash },
      },
    ]);

    return newUser;
  },

  /**
   * Traditional login (email/username + password).
   * Creates a session in sessionStorage.
   */
  async login(input: LoginInput): Promise<EhrSession> {
    const users = readUsers();
    const found = users.find((u) => u.role === input.role && matchUserIdentifier(u.email, input.emailOrUsername));

    if (found) {
      const ok = await verifyStoredPassword(input.password, found.password);
      if (!ok) throw new Error('Invalid credentials. Please check your email/password.');

      const session: EhrSession = {
        isLoggedIn: true,
        userRole: found.role,
        userEmail: found.email,
        userName: found.fullName,
        authMethod: 'traditional',
        loginTimestamp: Date.now(),
      };
      setSession(session);
      return session;
    }

    // Demo fallback
    const demo = getDemoUser(input.role);
    const demoMatch =
      (normalizeIdentifier(input.emailOrUsername) === normalizeIdentifier(demo.email) ||
        normalizeIdentifier(input.emailOrUsername) === input.role) &&
      input.password === demo.password;

    if (!demoMatch) throw new Error('Invalid credentials. Please check your email/password or register first.');

    const session: EhrSession = {
      isLoggedIn: true,
      userRole: input.role,
      userEmail: demo.email,
      userName: demo.fullName,
      authMethod: 'traditional',
      loginTimestamp: Date.now(),
    };
    setSession(session);
    return session;
  },
};


