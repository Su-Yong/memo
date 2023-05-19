declare namespace NodeJS {
  interface Process {
    env: {
      NODE_ENV: 'production' | 'development';
      SERVER_PORT: string | undefined;
      SERVER_HOST: string | undefined;

      LOGGER_PATH: string | undefined;
      LOGGER_TIMESTAMP_FORMAT: string | undefined;
      LOGGER_FILE_FORMAT: string | undefined;

      DATABASE_HOST: string | undefined;
      DATABASE_PORT: string | undefined;
      DATABASE_USERNAME: string | undefined;
      DATABASE_PASSWORD: string | undefined;
      DATABASE_DATABASE: string | undefined;
    }
  }
}

import { Config } from "src/utils/Config.js";
import { Logger } from "src/utils/logger/index.ts";
import { DataSource } from 'typeorm';

declare module "express" {
  export interface Request  {
    config?: Config;
    logger?: Logger;
    db?: DataSource;
    isContextInjected?: boolean;
  }
}
