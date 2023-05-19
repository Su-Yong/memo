declare namespace NodeJS {
  interface Process {
    env: {
      NODE_ENV: 'production' | 'development';
      SERVER_PORT: string | undefined;
      SERVER_HOST: string | undefined;

      LOGGER_PATH: string | undefined;
      LOGGER_TIMESTAMP_FORMAT: string | undefined;
      LOGGER_FILE_FORMAT: string | undefined;
    }
  }
}

import { Config } from "src/utils/Config.js";
import { Logger } from "src/utils/logger/index.ts";


declare module "express" {
  export interface Request  {
    config?: Config;
    logger?: Logger;
    isContextInjected?: boolean;
  }
}
