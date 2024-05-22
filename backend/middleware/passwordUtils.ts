import bcrypt from "bcrypt";

/**
 * Hashes a password
 * 
 * @param password - Password we are hashing
 */
const generatePasswordHash = (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verifies whether the provided password matches the stored password hash.
 * 
 * @param password - The plain text password to verify.
 * @param passwordHash - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the password matches the hash.
 */
const verifyPassword = (password: string, passwordHash: string): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash); 
}

export {
  generatePasswordHash,
  verifyPassword,
}