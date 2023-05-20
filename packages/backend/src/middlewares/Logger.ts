import { createMiddleware } from './Middleware.js';

export const LogHandler = createMiddleware((request, _, next) => {
  if (process.env.NODE_ENV === 'development') {
    request.logger.d(request.method, request.url, JSON.stringify(request.body, null, 2));
  }

  next();
});
