/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from 'express';
import z, { AnyZodObject } from 'zod';

import { O } from 'ts-toolbelt';

import { ContextRequest, createMiddleware } from '../middlewares/Middleware';
import { EntityTarget, ObjectLiteral, Repository, TreeRepository } from 'typeorm';
import { Config } from '../utils/Config';
import { CommonError } from '../models/Error';

export interface ControllerHookContext {
  request: ContextRequest;
  response: Response;
  next: NextFunction;
}
interface ParsedQs { [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[] }
export interface ControllerContext {
  useRequest: <T = ContextRequest>(getter?: (request: ContextRequest) => T) => T;
  useRequestBody: <Schema extends AnyZodObject = AnyZodObject>(schema?: Schema) => z.infer<Schema>;
  useParams: () => Record<string, string>;
  useQuery: () => ParsedQs;
  useConfig: () => Config;
  useDB: () => ContextRequest['db'];
  useRepository: <
    Entity extends ObjectLiteral,
    Mode extends 'default' | 'tree' = 'default'
  >(entity: EntityTarget<Entity>, mode?: Mode) => Mode extends 'tree' ? TreeRepository<Entity> : Repository<Entity>;
  useResponse: (statusCode: number, response?: string | O.Object) => void;

  context: ControllerHookContext;
}
export const createControllerContext = (options: ControllerHookContext): ControllerContext => {
  const useRequest: ControllerContext['useRequest'] = (getter = (it) => it as any) => getter(options.request);
  const useRequestBody: ControllerContext['useRequestBody'] = (schema) => {
    const body = useRequest((it) => it.body);

    if (schema) {
      const parsed = schema.safeParse(body);
      if (parsed.success) return parsed.data;

      const error = CommonError.COMMON_INVALID_BODY(400, parsed.error.message);
      error.errors = parsed.error.errors;

      throw error;
    }

    return body;
  };
  const useParams: ControllerContext['useParams'] = () => useRequest((it) => it.params);
  const useQuery: ControllerContext['useQuery'] = () => useRequest((it) => it.query);
  const useConfig: ControllerContext['useConfig'] = () => useRequest((it) => it.config);
  const useDB: ControllerContext['useDB'] = () => useRequest((it) => it.db);
  const useRepository = ((entity, mode) => {
    const db = useDB();

    if (mode === 'tree') return db.getTreeRepository(entity);
    return db.getRepository(entity);
  }) as ControllerContext['useRepository'];

  const useResponse: ControllerContext['useResponse'] = (statusCode, response) => {
    options.response.status(statusCode);

    if (response !== undefined) options.response.json(response);
    else options.response.sendStatus(statusCode);
  };


  return {
    useRequest,
    useRequestBody,
    useParams,
    useQuery,
    useConfig,
    useDB,
    useRepository,
    useResponse,

    context: options,
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
