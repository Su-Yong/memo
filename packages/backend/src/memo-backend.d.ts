declare namespace NodeJS {
  interface Process {
    env: {
      NODE_ENV: 'production' | 'development';
      SERVER_PORT: string | undefined;
      SERVER_HOST: string | undefined;
    }
  }
}

import { Config } from "src/utils/Config.js";
import Logger from "src/utils/Logger.ts";


declare module "express" {
  export interface Request  {
    config?: Config;
    logger?: Logger;
    isContextInjected?: boolean;
  }
}
