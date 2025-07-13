"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const registerUser = async (data) => {
    const { fullName, birthDate, email, password } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            fullName,
            birthDate: new Date(birthDate),
            email,
            password: hashedPassword,
        },
    });
    return user;
};
exports.registerUser = registerUser;
/**
 * Registers a new user in the database.
 * @param {Object} data - The user data to register.
 * @param {string} data.fullName - The full name of the user.
 * @param {string} data.birthDate - The birth date of the user in YYYY-MM-DD format.
 * @param {string} data.email - The email address of the user.
 * @param {string} data.password - The password for the user.
 * @returns {Promise<Object>} The created user object.
 * @throws {Error} If a user with the provided email already exists.
 * @throws {Error} If there is an issue with the database operation.
 > */ 
