import  { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
interface jwtPayload {
    userId: number;
    role: "ADMIN" | "USER";
}