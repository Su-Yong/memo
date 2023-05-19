import { NextFunction, Request, Response } from 'express';
import { Config } from '../utils/Config.js';
import { Logger } from '../utils/logger/index.js';
import { DataSource } from 'typeorm';

export interface Context {
  config: Config;
  logger: Logger;
  db: DataSource;
}

export const injectContext = ({
  config,
  logger,
  db,
}: Context) => {
  return (request: Request, _: Response, next: NextFunction) => {
    request.config = config;
    request.logger = logger;
    request.db = db;
    request.isContextInjected = true;

    next();
  };
};
