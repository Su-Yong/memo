import { NextFunction, Request, Response } from 'express';

export type ContextRequest = Omit<Request, 'config' | 'logger'> & Required<Pick<Request, 'config' | 'logger'>>;
export type Middleware = (request: Request, response: Response, next: NextFunction) => void;
export type ContextMiddleware = (request: ContextRequest, response: Response, next: NextFunction) => void;

export const createMiddleware = (middleware: ContextMiddleware): Middleware => (request, response, next) => {
  if (!request?.isContextInjected) throw Error('Context is not injected');

  middleware(request as ContextRequest, response, next);
};
