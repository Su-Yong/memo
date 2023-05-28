import { NextFunction, Request, Response } from 'express';
import { Config } from '../utils/Config';
import { Logger } from '../utils/logger/index';
import { DataSource } from 'typeorm';
import { Hocuspocus } from '@hocuspocus/server';

export interface Context {
  config: Config;
  logger: Logger;
  db: DataSource;
  editorServer: Hocuspocus;
}

export const injectContext = ({
  config,
  logger,
  db,
  editorServer,
}: Context) => {
  return (request: Request, _: Response, next: NextFunction) => {
    request.config = config;
    request.logger = logger;
    request.db = db;
    request.editorServer = editorServer;
    request.isContextInjected = true;

    next();
  };
};
