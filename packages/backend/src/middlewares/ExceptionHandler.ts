import { NextFunction, Request, Response } from 'express';

import { HttpError } from 'http-errors';
import { CommonError } from '../models/Error.js';

export const ExceptionHandler = (err: Error, request: Request, response: Response, next: NextFunction) => {
  if (response.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError || err instanceof CommonError) {
    response.status(err.status)
    response.json({
      code: err.code,
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  } else {
    response.status(500)
    response.json({ code: 'INTERNEL_SERVER_ERROR', status: 500, message: err.message });
    request.logger?.e('Internal Server Error', err);
  }
};
