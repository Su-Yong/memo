import { createMiddleware } from './Middleware.js';

export const LogHandler = createMiddleware((request, _, next) => {
  if (process.env.NODE_ENV === 'development') {
    request.logger.d('Request', request.method, request.url, request.body);
  }

  next();
});
