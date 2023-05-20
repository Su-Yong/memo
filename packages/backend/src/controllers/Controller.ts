/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from 'express';
import z, { AnyZodObject } from 'zod';
import HttpError from 'http-errors';

import { O } from 'ts-toolbelt';

import { ContextRequest, createMiddleware } from '../middlewares/Middleware.js';
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export interface CreateControllerContextOptions {
  request: ContextRequest;
  response: Response;
  next: NextFunction;
}
export interface ControllerContext {
  useRequest: <T = ContextRequest>(getter?: (request: ContextRequest) => T) => T;
  useRequestBody: <Schema extends AnyZodObject = AnyZodObject>(schema?: Schema) => z.infer<Schema>;
  useDB: () => ContextRequest['db'];
  useRepository: <Entity extends ObjectLiteral>(entity: EntityTarget<Entity>) => Repository<Entity>;
  useResponse: (statusCode: number, response?: string | O.Object) => void;
}
export const createControllerContext = (options: CreateControllerContextOptions): ControllerContext => {
  const useRequest: ControllerContext['useRequest'] = (getter = (it) => it as any) => getter(options.request);
  const useRequestBody: ControllerContext['useRequestBody'] = (schema) => {
    const body = useRequest((it) => it.body);

    if (schema) {
      const parsed = schema.safeParse(body);

      if (parsed.success) return parsed.data;

      throw HttpError(400, parsed.error.message);
    }

    return body;
  };
  const useDB: ControllerContext['useDB'] = () => useRequest((it) => it.db);
  const useRepository: ControllerContext['useRepository'] = (entity) => {
    const db = useDB();

    return db.getRepository(entity);
  };

  const useResponse: ControllerContext['useResponse'] = (statusCode, response) => {
    options.response.status(statusCode);

    if (response !== undefined) options.response.json(response);
  };


  return {
    useRequest,
    useRequestBody,
    useDB,
    useRepository,
    useResponse,
  };
};

/* controller */
export type ControllerFactory = (ctx: ControllerContext) => Promise<void>;
export const createController = (controllerFactory: ControllerFactory) => createMiddleware(async (request: ContextRequest, response: Response, next: NextFunction) => {
  const controllerContext = createControllerContext({
    request,
    response,
    next,
  });

  await controllerFactory(controllerContext);
});
