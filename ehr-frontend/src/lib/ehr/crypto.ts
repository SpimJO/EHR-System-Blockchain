/**
 * Crypto helpers (PBKDF2 hashing) ported from `/js/crypto-utils.js`,
 * but shaped for TypeScript and React usage.
 */

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export const cryptoService = {
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.crypto !== 'undefined' &&
      typeof window.crypto.subtle !== 'undefined'
    );
  },

  /**
   * Hash password using PBKDF2 (SHA-256).
   * Output is base64 of [salt(16 bytes) + derivedKey(32 bytes)].
   */
  async hashPassword(password: string): Promise<string> {
    if (!this.isSupported()) throw new Error('Web Crypto API is not supported in this browser');

    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const salt = window.crypto.getRandomValues(new Uint8Array(16));

    const key = await window.crypto.subtle.importKey(
      'raw',
      data,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
      key,
      256
    );

    const hashBytes = new Uint8Array(derivedBits);
    const combined = new Uint8Array(salt.length + hashBytes.length);
    combined.set(salt);
    combined.set(hashBytes, salt.length);

    return toBase64(combined);
  },

  async verifyPassword(password: string, stored: string): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const combined = fromBase64(stored);
      // Expect salt(16) + hash(32)
      if (combined.length !== 48) return false;

      const salt = combined.slice(0, 16);
      const storedHash = combined.slice(16);

      const encoder = new TextEncoder();
      const data = encoder.encode(password);

      const key = await window.crypto.subtle.importKey(
        'raw',
        data,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );

      const derivedBits = await window.crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
        key,
        256
      );

      const newHash = new Uint8Array(derivedBits);
      if (newHash.length !== storedHash.length) return false;

      for (let i = 0; i < newHash.length; i++) {
        if (newHash[i] !== storedHash[i]) return false;
      }

      return true;
    } catch {
      return false;
    }
  },
};


