import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/**
 * Authenticates a user by email and password.
 * - Checks if user exists
 * - Verifies password
 * - Checks if user is blocked
 * - Returns JWT token if successful
 * @param email User's email
 * @param password User's password
 * @returns Object with JWT token
 * @throws Error if authentication fails
 */
export const loginUser = async (email: string, password: string) => {
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Пользователь не найден');
  }

  // Compare provided password with stored hash
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Неверный пароль');
  }

  // Check if user is blocked
  if (user.status === 'BLOCKED') {
    throw new Error('Пользователь заблокирован');
  }

  // Generate JWT token with user ID and role
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, userId: user.id, role: user.role };
};
