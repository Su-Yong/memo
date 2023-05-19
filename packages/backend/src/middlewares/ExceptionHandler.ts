import { NextFunction, Request, Response } from 'express';

export const ExceptionHandler = (err: Error, request: Request, response: Response, next: NextFunction) => {
  if (response.headersSent) {
    return next(err);
  }

  try {
    next();
  } catch (err) {
    response.status(500)
    response.send({ error: err });
    request.logger?.e('Internal Server Error', err);
  }
};
