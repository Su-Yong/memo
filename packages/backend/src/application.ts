import express, { Express } from 'express';
import dotenv from 'dotenv';

import { Object } from 'ts-toolbelt';

import Logger from './middlewares/Logger.js';
import { Config, mergeConfig } from './utils/Config.js';

class Application {
  private app: Express | null = null;
  private logger: Logger | null = null;
  private config: Config | null = null;

  loadConfig() {
    dotenv.config();

    const customConfig: Object.Partial<Config, 'deep'> = {
      server: {
        host: process.env.SERVER_HOST,
        port: Number.isFinite(Number(process.env.SERVER_PORT)) ? Number(process.env.SERVER_PORT) : undefined,
      }
    };

    this.config = mergeConfig(customConfig);
  }

  initLogger() {
    this.logger = new Logger();
  }

  initServer() {
    this.app = express();
  }

  start() {
    if (!this.logger) throw Error('logger is not initialized');
    if (!this.app) throw Error('app is not initialized');
    if (!this.config) throw Error('config is not loaded');

    this.logger.i('Server starting...');

    this.app.listen(this.config.server.port, this.config.server.host, () => {
      this.logger?.i(`Server is running at ${this.config?.server.host}:${this.config?.server.port}`);
      this.logger?.d('Server Config:', JSON.stringify(this.config, null, 2));
    });
  }
}

export default Application;
