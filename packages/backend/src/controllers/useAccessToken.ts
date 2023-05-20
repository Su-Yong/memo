import JWT, { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';
import createHttpError from 'http-errors';

import { ControllerHookContext } from './Controller.js';
import UserSchema from '../domains/users/models/User.schema.js';

declare module "express" {
  export interface Request  {
    accessToken?: JwtPayload;
  }
}

export const useAccessToken = (context: ControllerHookContext) => {
  const { request } = context;

  const accessToken = request.headers.authorization;
  if (!accessToken) throw createHttpError(401, 'No access token provided');

  const { secret } = request.config.security;
  if (!secret) throw createHttpError(500, 'No secret provided');

  try {
    const parsedToken = JWT.verify(accessToken, secret);
    if (typeof parsedToken === 'string') throw Error('Invalid token');

    request.accessToken = parsedToken;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.name === "TokenExpiredError") throw createHttpError(419, 'Token expired');
    if (err.name === "JsonWebTokenError") throw createHttpError(401, 'Invalid access token');

    throw createHttpError(401, 'token error');
  }

  return request.accessToken as z.infer<typeof UserSchema.response>;
};
