/* eslint-disable @typescript-eslint/no-explicit-any */

import chalk from 'chalk';
import dayjs from 'dayjs';

type LogType = 'debug' | 'verbose' | 'warn' | 'error' | 'info';
const LogColor = {
  debug: 'inverse',
  verbose: 'dim',
  warn: 'yellow',
  error: 'red',
  info: 'blue',
} as const;

class Logger {
  private timestampFormat = 'YYYY-MM-DD hh:mm:ss';

  log(type: LogType, ...messages: any[]) {
    const timestamp = chalk.dim(`[${this.getTimestamp()}]`);
    const logType = chalk[LogColor[type]](`[${type}]`);

    console.log(timestamp, logType, ...messages);
  }

  info(...messages: any[]) {
    this.log('info', ...messages);
  }

  debug(...messages: any[]) {
    this.log('debug', ...messages);
  }

  verbose(...messages: any[]) {
    this.log('verbose', ...messages);
  }

  warn(...messages: any[]) {
    this.log('warn', ...messages);
  }

  error(...messages: any[]) {
    this.log('error', ...messages);
  }

  i = this.info;
  d = this.debug;
  v = this.verbose;
  w = this.warn;
  e = this.error;

  setTimestampFormat(format: string) {
    this.timestampFormat = format;
  }

  private getTimestamp() {
    return dayjs().format(this.timestampFormat);
  }
}

export default Logger;
