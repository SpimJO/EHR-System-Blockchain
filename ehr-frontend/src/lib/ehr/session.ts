import type { AuthMethod, EhrSession, UserRole } from './types';
import {
  readSessionStorage,
  removeSessionStorage,
  safeJsonParse,
  writeSessionStorage,
} from './storage';

const SESSION_KEY = 'ehr_session';

// Backwards-compatible keys (from the old HTML/JS version)
const LEGACY_KEYS = {
  isLoggedIn: 'isLoggedIn',
  userRole: 'userRole',
  userEmail: 'userEmail',
  userName: 'userName',
  authMethod: 'authMethod',
  walletAddress: 'walletAddress',
  chainId: 'chainId',
  loginTimestamp: 'loginTimestamp',
} as const;

function isUserRole(value: string): value is UserRole {
  return value === 'patient' || value === 'doctor' || value === 'staff';
}

function isAuthMethod(value: string): value is AuthMethod {
  return value === 'traditional' || value === 'metamask';
}

export function getSession(): EhrSession | null {
  if (typeof window === 'undefined') return null;

  const raw = readSessionStorage(SESSION_KEY);
  const parsed = raw ? safeJsonParse<unknown>(raw) : null;
  if (
    parsed &&
    typeof parsed === 'object' &&
    'isLoggedIn' in parsed &&
    (parsed as { isLoggedIn?: unknown }).isLoggedIn === true
  ) {
    const s = parsed as Partial<EhrSession>;
    if (
      s.isLoggedIn === true &&
      typeof s.userEmail === 'string' &&
      typeof s.userName === 'string' &&
      typeof s.loginTimestamp === 'number' &&
      typeof s.userRole === 'string' &&
      isUserRole(s.userRole) &&
      typeof s.authMethod === 'string' &&
      isAuthMethod(s.authMethod)
    ) {
      return s as EhrSession;
    }
  }

  // Legacy fallback (separate keys)
  const isLoggedIn = readSessionStorage(LEGACY_KEYS.isLoggedIn);
  const userRole = readSessionStorage(LEGACY_KEYS.userRole);
  const userEmail = readSessionStorage(LEGACY_KEYS.userEmail);
  const userName = readSessionStorage(LEGACY_KEYS.userName);
  const authMethod = readSessionStorage(LEGACY_KEYS.authMethod);
  const loginTimestampRaw = readSessionStorage(LEGACY_KEYS.loginTimestamp);

  if (
    isLoggedIn === 'true' &&
    userRole &&
    isUserRole(userRole) &&
    userEmail &&
    userName &&
    authMethod &&
    isAuthMethod(authMethod)
  ) {
    const loginTimestamp = loginTimestampRaw ? Number(loginTimestampRaw) : Date.now();
    const walletAddress = readSessionStorage(LEGACY_KEYS.walletAddress) ?? undefined;
    const chainId = readSessionStorage(LEGACY_KEYS.chainId) ?? undefined;

    const session: EhrSession = {
      isLoggedIn: true,
      userRole,
      userEmail,
      userName,
      authMethod,
      walletAddress,
      chainId,
      loginTimestamp,
    };

    // Upgrade to JSON session for future reads
    writeSessionStorage(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  return null;
}

export function setSession(session: EhrSession): void {
  writeSessionStorage(SESSION_KEY, JSON.stringify(session));

  // Mirror legacy keys (helps if you still open old HTML pages for debugging)
  writeSessionStorage(LEGACY_KEYS.isLoggedIn, 'true');
  writeSessionStorage(LEGACY_KEYS.userRole, session.userRole);
  writeSessionStorage(LEGACY_KEYS.userEmail, session.userEmail);
  writeSessionStorage(LEGACY_KEYS.userName, session.userName);
  writeSessionStorage(LEGACY_KEYS.authMethod, session.authMethod);
  writeSessionStorage(LEGACY_KEYS.loginTimestamp, String(session.loginTimestamp));

  if (session.walletAddress) writeSessionStorage(LEGACY_KEYS.walletAddress, session.walletAddress);
  if (session.chainId) writeSessionStorage(LEGACY_KEYS.chainId, session.chainId);
}

export function clearSession(): void {
  removeSessionStorage(SESSION_KEY);
  removeSessionStorage(LEGACY_KEYS.isLoggedIn);
  removeSessionStorage(LEGACY_KEYS.userRole);
  removeSessionStorage(LEGACY_KEYS.userEmail);
  removeSessionStorage(LEGACY_KEYS.userName);
  removeSessionStorage(LEGACY_KEYS.authMethod);
  removeSessionStorage(LEGACY_KEYS.walletAddress);
  removeSessionStorage(LEGACY_KEYS.chainId);
  removeSessionStorage(LEGACY_KEYS.loginTimestamp);
}


