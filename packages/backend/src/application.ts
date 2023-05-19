import express, { Express } from 'express';
import dotenv from 'dotenv';

import { Object } from 'ts-toolbelt';

import router from './controllers/router.js';
import { Config, mergeConfig } from './utils/Config.js';
import { injectContext } from './middlewares/Context.js';
import { ExceptionHandler } from './middlewares/ExceptionHandler.js';
import { LogHandler } from './middlewares/Logger.js';
import { Logger } from './utils/logger/index.js';

class Application {
  private app: Express | null = null;
  private logger: Logger | null = null;
  private _config: Config | null = null;

  get config() {
    return this._config;
  }

  initConfig() {
    dotenv.config();

    const customConfig: Object.Partial<Config, 'deep'> = {
      server: {
        host: process.env.SERVER_HOST,
        port: Number.isFinite(Number(process.env.SERVER_PORT)) ? Number(process.env.SERVER_PORT) : undefined,
      },
      logger: {
        path: process.env.LOGGER_PATH,
        timestampFormat: process.env.LOGGER_TIMESTAMP_FORMAT,
        fileFormat: process.env.LOGGER_FILE_FORMAT,
      },
    };

    this._config = mergeConfig(customConfig);
  }

  initLogger(logger: Logger) {
    this.logger = logger;
  }

  initServer() {
    if (!this.logger) throw Error('logger is not initialized');
    if (!this.config) throw Error('config is not loaded');

    this.app = express();

    this.app.use(injectContext({
      config: this.config,
      logger: this.logger,
    }));
    this.app.use(ExceptionHandler);
    this.app.use(LogHandler);

    this.app.use('/', router);
  }

  start() {
    if (!this.logger) throw Error('logger is not initialized');
    if (!this.config) throw Error('config is not loaded');
    if (!this.app) throw Error('app is not initialized');

    this.logger.i('Server starting...');

    this.app.listen(this.config.server.port, this.config.server.host, () => {
      this.logger?.i(`Server is running at ${this.config?.server.host}:${this.config?.server.port}`);
      this.logger?.d('Server Config:', JSON.stringify(this.config, null, 2));
    });
  }
}

export default Application;
