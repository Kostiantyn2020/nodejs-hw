import express from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import { refreshUserSession } from '../controllers/authController.js';

const router = express.Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/refresh', refreshUserSession);

router.post('/auth/logout', refreshUserSession);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);

export default router;
