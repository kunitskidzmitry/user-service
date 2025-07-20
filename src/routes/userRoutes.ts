import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middlewares/authMiddelware'; // Middleware for JWT authentication

const prisma = new PrismaClient();
const router = Router();

// Interface for requests with authenticated user info
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'ADMIN' | 'USER';
  };
}

/**
 * @route   GET /api/me
 * @desc    Returns info about the current authenticated user
 * @access  Authorized users
 */
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Find user by ID from JWT payload
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId } // req.user is set by middleware
    });

    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении пользователя' });
  }
});

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  ADMIN only
 */
router.get('/users', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Only admin can access this route
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Доступ запрещён' });
      return;
    }

    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении списка пользователей' });
  }
});

/**
 * @route   PATCH /api/block/:id
 * @desc    Block a user (by self or admin)
 * @access  ADMIN or account owner
 */
router.patch('/block/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Only admin or the user themselves can block
    if (req.user!.role !== 'ADMIN' && req.user!.userId !== id) {
      res.status(403).json({ error: 'Нет прав на блокировку этого пользователя' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: 'BLOCKED' }
    });

    res.json({ message: `Пользователь ${updatedUser.email} заблокирован` });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при блокировке пользователя' });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (admin or self)
 * @access  ADMIN or account owner
 */
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Only admin or the user themselves can access
    if (req.user!.role !== 'ADMIN' && req.user!.userId !== id) {
      res.status(403).json({ error: 'Нет доступа к этому пользователю' });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении пользователя' });
  }
});

export default router;
