import JWT, { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';

import { ControllerHookContext } from './Controller';
import UserSchema from '../domains/users/models/User.schema';
import { CommonError } from '../models/Error';

declare module "express" {
  export interface Request  {
    accessToken?: JwtPayload;
  }
}

export const useAccessToken = (context: ControllerHookContext) => {
  const { request } = context;

  const auth = request.headers.authorization;
  if (!auth) throw CommonError.AUTH_NO_ACCESS_TOKEN();
  const [authType, accessToken] = auth.split(' ');

  if (authType !== 'Bearer') throw CommonError.AUTH_INVALID_TOKEN(401, 'Invalid access token type');

  const { secret } = request.config.security;
  if (!secret) throw CommonError.INTERNAL_SERVER_ERROR(500, 'No secret provided');

  try {
    const parsedToken = JWT.verify(accessToken, secret);
    if (typeof parsedToken === 'string') throw CommonError.AUTH_INVALID_TOKEN();

    request.accessToken = parsedToken;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.name === "TokenExpiredError") throw CommonError.AUTH_EXPIRED_TOKEN();
    if (err.name === "JsonWebTokenError") throw CommonError.AUTH_INVALID_TOKEN();

    throw CommonError.INTERNAL_SERVER_ERROR();
  }

  return request.accessToken as z.infer<typeof UserSchema.response>;
};
