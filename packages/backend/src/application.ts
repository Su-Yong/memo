import express, { Express } from 'express';
import dotenv from 'dotenv';

import { Object } from 'ts-toolbelt';

import router from './controllers/router.js';
import { Config, mergeConfig } from './utils/Config.js';
import { injectContext } from './middlewares/Context.js';
import { ExceptionHandler } from './middlewares/ExceptionHandler.js';
import { LogHandler } from './middlewares/Logger.js';
import { Logger } from './utils/logger/index.js';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions.js';
import bodyParser from 'body-parser';

class Application {
  private app: Express | null = null;
  private logger: Logger | null = null;
  private _config: Config | null = null;
  private dataSource: DataSource | null = null;

  get config() {
    return this._config;
  }

  loadConfig() {
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
      database: {
        host: process.env.DATABASE_HOST,
        port: Number.isFinite(Number(process.env.DATABASE_PORT)) ? Number(process.env.DATABASE_PORT) : undefined,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
      },
    };

    this._config = mergeConfig(customConfig);

    this.logger?.v('Config is loaded');
  }

  initLogger(logger: Logger) {
    this.logger = logger;

    this.logger.v('Logger is initialized');
  }

  async initDatabase(dbOptions: Omit<MysqlConnectionOptions, 'type'>) {
    this.dataSource = new DataSource({
      type: 'mariadb',
      ...dbOptions,
      synchronize: true,
      entities: [
        'src/**/models/*.model.js',
        'dist/**/models/*.model.js',
      ],
    });

    await this.dataSource.initialize();

    this.logger?.v('Database is initialized');
  }

  initServer() {
    if (!this.logger) throw Error('logger is not initialized');
    if (!this.config) throw Error('config is not loaded');
    if (!this.dataSource) throw Error('database is not initialized');

    this.app = express();

    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))

    this.app.use(injectContext({
      config: this.config,
      logger: this.logger,
      db: this.dataSource,
    }));
    this.app.use(LogHandler);

    this.app.use('/', router);

    this.app.use(ExceptionHandler);
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
