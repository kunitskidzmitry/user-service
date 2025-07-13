"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userService_1 = require("../services/userService");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const user = await (0, userService_1.registerUser)(req.body);
        res.status(201).json({ id: user.id, message: 'Пользователь зарегистрирован' });
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Ошибка регистрации' });
    }
});
exports.default = router;
// This code defines an Express router for user registration. It imports the `registerUser` function from the `userService` and sets up a POST route at `/register`. When a request is made to this route, it attempts to register a new user with the provided data. If successful, it responds with a 201 status and the user's ID; if there's an error, it responds with a 400 status and an error message.
// The router is then exported for use in the main application file.
