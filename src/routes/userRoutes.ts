import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middlewares/authMiddelware'; // Adjust the path as necessary

const prisma = new PrismaClient();
const router = Router();
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'ADMIN' | 'USER';
  };
}


/**
 * @route GET /api/me
 * @desc Возвращает информацию о текущем пользователе
 * @access Авторизованные пользователи
 */
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId } // req.user добавляется через middleware
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
 * @route GET /api/users
 * @desc Получение всех пользователей (только для админа)
 * @access Только ADMIN
 */
router.get('/users', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
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
 * @route PATCH /api/block/:id
 * @desc Блокировка пользователя (самого себя или админом)
 * @access ADMIN или владелец аккаунта
 */
router.patch('/block/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Проверка прав доступа
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
// GET /users/:id — только для админа или самого пользователя
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Только админ или сам пользователь
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
