import JWT from 'jsonwebtoken';
import { Context } from '@/middlewares/Context';
import { onAuthenticatePayload } from '@hocuspocus/server';

export const getAuthEvent = (context: Pick<Context, 'config'>) => {
  return async (data: onAuthenticatePayload) => {
    try {
      const parsedToken = JWT.verify(data.token, context.config.security.secret);
      if (typeof parsedToken === 'string') return null;

      return parsedToken;
    } catch {
      return null;
    }
  };
};
