import { Router } from 'express';
import { registerUser } from '../services/userService';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ id: user.id, message: 'Пользователь зарегистрирован' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Ошибка регистрации' });
  }
});

export default router;
// This code defines an Express router for user registration. It imports the `registerUser` function from the `userService` and sets up a POST route at `/register`. When a request is made to this route, it attempts to register a new user with the provided data. If successful, it responds with a 201 status and the user's ID; if there's an error, it responds with a 400 status and an error message.
// The router is then exported for use in the main application file.