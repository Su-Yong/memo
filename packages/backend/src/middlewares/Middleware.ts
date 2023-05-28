import { NextFunction, Request, Response } from 'express';

type ContextField = 'config' | 'logger' | 'db' | 'editorServer';
export type ContextRequest = Omit<Request, ContextField> & Required<Pick<Request, ContextField>>;
export type Middleware = (request: Request, response: Response, next: NextFunction) => void;
export type ContextMiddleware = (request: ContextRequest, response: Response, next: NextFunction) => void | Promise<void>;

export const createMiddleware = (middleware: ContextMiddleware): Middleware => (request, response, next) => {
  if (!request?.isContextInjected) throw Error('Context is not injected');

  const result = middleware(request as ContextRequest, response, next);

  if (result instanceof Promise) result.catch((err) => next(err));
};
