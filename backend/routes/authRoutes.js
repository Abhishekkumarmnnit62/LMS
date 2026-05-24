import express from 'express';
import {body} from 'express-validator';
import{
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';
const router = express.Router();

//Validation Middleware
const registerValidation = [
    body('username')
         .trim()
         .isLength({ min: 3, max: 30 })
         .withMessage('Username must be between 3 and 30 characters'),

    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),   
];

//Public Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);      

//Protected Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);        

export default router;