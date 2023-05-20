import { NextFunction, Request, Response } from 'express';

export const ExceptionHandler = (err: Error, request: Request, response: Response, next: NextFunction) => {
  if (response.headersSent) {
    return next(err);
  }

  response.status(500)
  response.json({ code: 'INTERNEL_SERVER_ERROR', status: 500, error: err });
  request.logger?.e('Internal Server Error', err);
};
