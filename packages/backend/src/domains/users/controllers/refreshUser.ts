import { createController } from '../../../controllers/Controller';
import { AuthSchema, User } from '@suyong/memo-core';
import JWT from 'jsonwebtoken';
import { CommonError } from '../../../models/Error';
import { Token } from '../models/Token';

export const refreshUser = createController(async ({ useResponse, useConfig, useRequestBody }) => {
  const body = useRequestBody(AuthSchema.refreshTokenRequest);
  const config = useConfig();

  try {
    const token = JWT.verify(body.refreshToken, config.security.secret);
    if (!token) throw CommonError.AUTH_INVALID_TOKEN();

    const parsedToken = await AuthSchema.refreshToken.parseAsync(token).catch(() => null);
    if (!parsedToken) throw CommonError.AUTH_NOT_REFRESH_TOKEN();

    const { iat, exp, type, ...user } = parsedToken;

    const accessToken = JWT.sign(Token.toResponse(user as User, 'accessToken'), config.security.secret, { expiresIn: '1h' });
    const refreshToken = JWT.sign(Token.toResponse(user as User, 'refreshToken'), config.security.secret, { expiresIn: '7d' });

    useResponse(200, {
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    const invalidError = CommonError.AUTH_INVALID_TOKEN();
    invalidError.cause = err;
    if (err && typeof err === 'object') invalidError.errors.push(err);
    throw invalidError;
  }
});
