import Application from './application.js';

(async () => {
  const app = new Application();

  app.initLogger();
  app.initServer();

  app.loadConfig();

  app.start();
})().catch((err) => {
  console.error('Cannot start server', err);
});
