import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(401, 'Email or password is wrong');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createHttpError(401, 'Email or password is wrong');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: 'Password reset email sent successfully',
      });
    }

    const token = jwt.sign(
      {
        sub: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'reset-password-email.html',
    );

    const templateSource = await fs.readFile(templatePath, 'utf-8');

    const template = handlebars.compile(templateSource);

    const html = template({
      name: user.username || user.email,
      link: resetLink,
    });

    try {
      await sendEmail({
        to: email,
        subject: 'Reset your password',
        html,
      });
    } catch {
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    }

    res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Invalid or expired token');
    }

    const { sub, email } = decoded;

    const user = await User.findOne({
      _id: sub,
      email,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
export const refreshUserSession = async (req, res, next) => {
  try {
    const { _id, email } = req.user;

    res.status(200).json({
      user: {
        id: _id,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};
