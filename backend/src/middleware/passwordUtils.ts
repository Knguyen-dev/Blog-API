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

/**
 * Generates a url to the frontend's password reset page.
 * 
 * @param resetToken - The password reset token, in plain text,
 */
const generatePasswordResetUrl = (resetToken: string) => {
  return `${process.env.CLIENT_URL}/auth/resetPassword/${resetToken}`
}

/**
 * Returns a url to the frontend's verify email page
 * 
 * @param verifyEmailToken - A plain-text version an email verification toekn
 */
const generateVerifyEmailUrl = (verifyEmailToken: string) => {
  return `${process.env.CLIENT_URL}/verifyEmail/${verifyEmailToken}`
}

export {
  generatePasswordHash,
  verifyPassword,
  generatePasswordResetUrl,
  generateVerifyEmailUrl
}