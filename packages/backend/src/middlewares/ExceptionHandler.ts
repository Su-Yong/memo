import { NextFunction, Request, Response } from 'express';

import { HttpError } from 'http-errors';

export const ExceptionHandler = (err: Error, request: Request, response: Response, next: NextFunction) => {
  if (response.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError) {
    response.status(err.status)
    response.json({
      code: err.code,
      status: err.status,
      message: err.message,
    });
  } else {
    response.status(500)
    response.json({ code: 'INTERNEL_SERVER_ERROR', status: 500, message: err.message });
    request.logger?.e('Internal Server Error', err);
  }
};
