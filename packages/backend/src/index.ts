import Application from './application.js';
import FileLogger from './utils/logger/FileLogger.js';

(async () => {
  const app = new Application();
  app.initConfig();

  const logger = new FileLogger(app.config!.logger.path);
  app.initLogger(logger);
  app.initServer();

  app.start();
})().catch((err) => {
  console.error('Cannot start server', err);
});
