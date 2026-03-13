import express from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
} from '../controllers/authController.js';

import { resetPasswordSchema } from '../validations/authValidation.js';
import { resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);

router.post('/auth/login', celebrate(loginUserSchema), loginUser);

router.post('/auth/refresh', refreshUserSession);

router.post('/auth/logout', logoutUser);

router.post(
  '/request-reset-email',
  celebrate({ body: requestResetEmailSchema }),
  requestResetEmail,
);

router.post(
  '/reset-password',
  celebrate({ body: resetPasswordSchema }),
  resetPassword,
);

export default router;
