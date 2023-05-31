import express from 'express';
import expressWs, { Application as Express } from 'express-ws';

import dotenv from 'dotenv';
import fs from 'node:fs/promises';

import { Object } from 'ts-toolbelt';
import { Hocuspocus, Server as EditorServer } from '@hocuspocus/server';
import { Logger as EditorLogger } from '@hocuspocus/extension-logger';

import { getRouter } from './controllers/router';
import { Config, mergeConfig } from './utils/Config';
import { injectContext } from './middlewares/Context';
import { ExceptionHandler } from './middlewares/ExceptionHandler';
import { LogHandler } from './middlewares/Logger';
import { Logger } from './utils/logger/index';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import bodyParser from 'body-parser';
import { getModelList } from './models/model';
import { getDatabaseExtension } from './domains/memos/services/database';
import { getAuthEvent } from './domains/memos/services/auth';

class Application {
  private app: Express | null = null;
  private logger: Logger | null = null;
  private _config: Config | null = null;
  private dataSource: DataSource | null = null;

  private editorApp: Hocuspocus | null = null;

  get config() {
    return this._config;
  }

  loadConfig() {
    dotenv.config();

    const customConfig: Object.Partial<Config, 'deep'> = {
      server: {
        host: process.env.SERVER_HOST,
        port: Number.isFinite(Number(process.env.SERVER_PORT)) ? Number(process.env.SERVER_PORT) : undefined,
        filePath: process.env.SERVER_FILE_PATH,
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
      security: {
        secret: process.env.SECURITY_SECRET,
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
      logging: false,
      synchronize: true,
      entities: getModelList(),
    });

    await this.dataSource.initialize();
    if (this.config) {
      await fs.mkdir(this.config.server.filePath, { recursive: true }).catch(() => null);
    } else {
      this.logger?.w('database is initialized but file path is not set');
    }

    this.logger?.v('Database is initialized');
  }

  async initServer() {
    if (!this.logger) throw Error('logger is not initialized');
    if (!this.config) throw Error('config is not loaded');
    if (!this.dataSource) throw Error('database is not initialized');
    if (!this.editorApp) throw Error('editorServer is not initialized');

    const { app } = expressWs(express());
    this.app = app;

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(injectContext({
      config: this.config,
      logger: this.logger,
      db: this.dataSource,
      editorServer: this.editorApp,
    }));
    this.app.use(LogHandler);

    this.app.use('/api', getRouter());

    this.app.use(ExceptionHandler);
  }

  initEditorServer() {
    if (!this.logger) throw Error('logger is not initialized');
    if (!this.config) throw Error('config is not loaded');
    if (!this.dataSource) throw Error('db is not loaded');

    const self = this;
    this.editorApp = EditorServer.configure({
      async connected() {
        self.logger?.d("connections:", self.editorApp?.getConnectionsCount());
      },
      async onConnect(data) {
        self.logger?.d(`"${data}" has connected.`);
      },
      async onDestroy(data) {
        // Output some information
        self.logger?.d(`Server was shut down!`);
      },
      async onDisconnect(data) {
        // Output some information
        self.logger?.d(`"${data}" has disconnected.`);
      },
      onAuthenticate: getAuthEvent({ config: this.config }),
      extensions: [
        new EditorLogger({
          log: (message: string) => this.logger?.i('[editor]', message),
        }),
        getDatabaseExtension({
          config: this.config,
          logger: this.logger,
          db: this.dataSource,
        }),
      ],
    });
  }

  start() {
    if (!this.logger) throw Error('logger is not initialized');
    if (!this.config) throw Error('config is not loaded');
    if (!this.app) throw Error('app is not initialized');

    this.logger.i('Server starting...');
    this.app.listen(this.config.server.port, this.config.server.host, () => {
      this.logger?.i(`Server is running at ${this.config?.server.host}:${this.config?.server.port}`);
      // this.logger?.d('Server Config:', JSON.stringify(this.config, null, 2));
    });
  }
}

export default Application;
