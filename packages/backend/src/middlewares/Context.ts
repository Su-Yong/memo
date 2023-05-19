import { NextFunction, Request, Response } from 'express';
import { Config } from 'src/utils/Config.js';
import Logger from '../utils/Logger.js';

export interface Context {
  config: Config;
  logger: Logger;
}

export const injectContext = ({
  config,
  logger,
}: Context) => {
  return (request: Request, _: Response, next: NextFunction) => {
    request.config = config;
    request.logger = logger;
    request.isContextInjected = true;

    next();
  };
};
