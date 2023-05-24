/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { HttpError } from 'http-errors';
import { O } from 'ts-toolbelt';

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
  public errors: O.Object[] = [];
  public headers?: { [key: string]: string; } | undefined;

  @error(500, 'Internal Server Error')
  static INTERNAL_SERVER_ERROR(status?: number, msg?: string): CommonError { return {} as any }
  @error(400, 'Request body is invalid shape')
  static COMMON_INVALID_BODY(status?: number, msg?: string): CommonError { return {} as any }

  // auth
  @error(403, 'You are not allowed to access this resource')
  static AUTH_NOT_ALLOWED_RESOURCE(status?: number, msg?: string): CommonError { return {} as any }
  @error(401, 'No access token provided')
  static AUTH_NO_ACCESS_TOKEN(status?: number, msg?: string): CommonError { return {} as any }
  @error(400, 'Token is invalid')
  static AUTH_INVALID_TOKEN(status?: number, msg?: string): CommonError { return {} as any }
  @error(400, 'Token is expired')
  static AUTH_EXPIRED_TOKEN(status?: number, msg?: string): CommonError { return {} as any }

  // users
  @error(407, 'User is already registered')
  static USER_ALREADY_EXIST(status?: number, msg?: string): CommonError { return {} as any }
  @error(401, 'Password is not valid')
  static USER_INVALID_PASSWORD(status?: number, msg?: string): CommonError { return {} as any }
  @error(404, 'User not found')
  static USER_NOT_FOUND(status?: number, msg?: string): CommonError { return {} as any }
  @error(403, 'You are not allowed to access this user')
  static USER_NOT_ALLOWED_RESOURCE(status?: number, msg?: string): CommonError { return {} as any }

  // workspaces
  @error(404, 'Workspace not found')
  static WORKSPACE_NOT_FOUND(status?: number, msg?: string): CommonError { return {} as any }
  @error(403, 'You are not allowed to access this workspace')
  static WORKSPACE_NOT_ALLOWED_RESOURCE(status?: number, msg?: string): CommonError { return {} as any }

  // files
  @error(404, 'File not found')
  static FILE_NOT_FOUND(status?: number, msg?: string): CommonError { return {} as any }
  @error(403, 'You are not allowed to access this file')
  static FILE_NOT_ALLOWED_RESOURCE(status?: number, msg?: string): CommonError { return {} as any }

  // workspaces
  @error(404, 'Memo not found')
  static MEMO_NOT_FOUND(status?: number, msg?: string): CommonError { return {} as any }
  @error(403, 'You are not allowed to access this memo')
  static MEMO_NOT_ALLOWED_RESOURCE(status?: number, msg?: string): CommonError { return {} as any }

  constructor(code: string, status: number, message?: string) {
    super(message);

    this.message;
    this.status = status;
    this.statusCode = status;
    this.code = code;
  }
}
