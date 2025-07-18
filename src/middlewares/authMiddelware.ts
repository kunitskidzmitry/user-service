import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Тип payload внутри JWT токена
interface JwtPayload {
  userId: string;
  role: 'ADMIN' | 'USER';
}

// Ручное расширение типа Request внутри этого файла
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Нет токена' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded; // теперь TypeScript не ругается
    next();
  } catch (err) {
    res.status(403).json({ error: 'Неверный токен' });
  }
};
