import { NextFunction, Request, Response } from 'express';

export type ContextRequest = Omit<Request, 'config' | 'logger' | 'db'> & Required<Pick<Request, 'config' | 'logger' | 'db'>>;
export type Middleware = (request: Request, response: Response, next: NextFunction) => void;
export type ContextMiddleware = (request: ContextRequest, response: Response, next: NextFunction) => void | Promise<void>;

export const createMiddleware = (middleware: ContextMiddleware): Middleware => (request, response, next) => {
  if (!request?.isContextInjected) throw Error('Context is not injected');

  const result = middleware(request as ContextRequest, response, next);

  if (result instanceof Promise) result.catch((err) => next(err));
};
