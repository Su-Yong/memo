import Application from './application.js';
import FileLogger from './utils/logger/FileLogger.js';

import 'reflect-metadata';

(async () => {
  const app = new Application();
  app.loadConfig();

  if (!app.config) throw Error('Config is not loadded');

  const logger = new FileLogger(app.config.logger.path);
  app.initLogger(logger);

  await app.initDatabase({
    host: app.config.database.host, 
    port: app.config.database.port,
    username: app.config.database.username,
    password: app.config.database.password,
    database: app.config.database.database,
  });

  app.initServer();
  app.start();
})().catch((err) => {
  console.error('Cannot start server', err);
});
