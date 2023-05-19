/* eslint-disable @typescript-eslint/no-explicit-any */
export type LogType = 'debug' | 'verbose' | 'warn' | 'error' | 'info';
export interface Logger {
  log(type: LogType, ...messages: any[]): void;

  debug(...messages: any[]): void;
  verbose(...messages: any[]): void;
  warn(...messages: any[]): void;
  error(...messages: any[]): void;
  info(...messages: any[]): void;

  i(...messages: any[]): void;
  d(...messages: any[]): void;
  v(...messages: any[]): void;
  w(...messages: any[]): void;
  e(...messages: any[]): void;
}
