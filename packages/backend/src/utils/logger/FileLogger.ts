/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs';

import ConsoleLogger from './ConsoleLogger.js';
import { LogType } from './types.js';
import dayjs from 'dayjs';

class FileLogger extends ConsoleLogger {
  private logFolderPath: string;
  protected logFileFormat = 'YYYY-MM-DD';

  constructor(logFolderPath: string) {
    super();

    this.logFolderPath = logFolderPath;

    fs.mkdirSync(logFolderPath, { recursive: true });
  }

  log(type: LogType, ...messages: any[]) {
    super.log(type, ...messages);

    const filePath = `${this.logFolderPath}/${this.getLogFileName()}`;
    fs.appendFileSync(filePath, `[${super.getTimestamp()}] [${type}] ${messages.join(' ')}\n`);
  }

  protected getLogFileName() {
    return `memo-${dayjs().format(this.logFileFormat)}.log`;
  }
}

export default FileLogger;
