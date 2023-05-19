import { createMiddleware } from '../middlewares/Middleware.js';

export const ping = createMiddleware((request, response, next) => {
  response.send('pong!');
});
