import crypto from 'crypto';

/**
 * Hashes the given password using SHA-256.
 *
 * @param password - The password to hash.
 * @returns The hashed password as a hex string.
 */
export const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};
