import crypto from 'crypto';
import { Session } from '../models/session.js';

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('hex');
  const refreshToken = crypto.randomBytes(30).toString('hex');

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return session;
};
