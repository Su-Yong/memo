/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { HttpError } from 'http-errors'

const error = (defaultStatus: number, defaultMessage?: string) => <T extends (status?: number, message?: string) => any>(
  _: typeof CommonError,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
) => {
  if (!descriptor.value) return;
  
  descriptor.value = ((status?: number, message?: string) => new CommonError(propertyKey, status ?? defaultStatus, message ?? defaultMessage)) as T;
};

export class CommonError extends Error implements HttpError {
  public code: string;
  public status: number;
  public statusCode: number;
  public expose = true;
  public headers?: { [key: string]: string; } | undefined;

  @error(500, 'Internal Server Error')
  static INTERNAL_SERVER_ERROR(status?: number, msg?: string) {}

  // users
  @error(401, 'Password is not valid')
  static USER_INVALID_PASSWORD(status?: number, msg?: string) {}
  @error(404, 'User not found')
  static USER_NOT_FOUND(status?: number, msg?: string) {}

  constructor(code: string, status: number, message?: string) {
    super(message);

    this.message;
    this.status = status;
    this.statusCode = status;
    this.code = code;
  }
}
