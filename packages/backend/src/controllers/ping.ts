import { createMiddleware } from '../middlewares/Middleware';

export const ping = createMiddleware((request, response, next) => {
  response.send('pong!');
});
