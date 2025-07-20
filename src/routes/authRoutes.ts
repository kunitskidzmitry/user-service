import { Router } from 'express';
import { loginUser } from '../services/authService';
import { registerUser } from '../services/userService';

// Create a new Express router instance
const router = Router();

// Route for user registration
router.post('/register', async (req, res) => {
  try {
    // Attempt to register a new user with the provided request body
    const user = await registerUser(req.body);
    // Respond with the new user's ID and a success message
    res.status(201).json({ id: user.id, message: 'Пользователь зарегистрирован' });
  } catch (error: any) {
    // Handle registration errors
    res.status(400).json({ error: error.message || 'Ошибка регистрации' });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;
    // Attempt to log in the user
    const result = await loginUser(email, password);
    // Respond with the login result (e.g., token, user info)
    res.json(result);
  } catch (error: any) {
    // Handle login errors
    res.status(401).json({ error: error.message });
  }
});

// Export the router to be used in the main application
export default router;
