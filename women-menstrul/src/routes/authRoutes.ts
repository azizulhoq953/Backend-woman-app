import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const AuthRoutes = express.Router();

// Route for user registration
AuthRoutes.post('/register', registerUser);

// Route for user login
AuthRoutes.post('/login', loginUser);

export default AuthRoutes;