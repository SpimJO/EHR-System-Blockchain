/**
 * Tiny localStorage/sessionStorage helpers.
 * Keep them dependency-free so they can be used from route middleware, services, and UI.
 */

export function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function readLocalStorageJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  const parsed = safeJsonParse<T>(raw);
  return parsed ?? fallback;
}

export function writeLocalStorageJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
  // StorageEvent does NOT fire in the same tab, so we emit a custom event too.
  window.dispatchEvent(new CustomEvent('ehr:storage', { detail: { key } }));
}

export function readSessionStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(key);
}

export function writeSessionStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(key, value);
}

export function removeSessionStorage(key: string): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(key);
}


