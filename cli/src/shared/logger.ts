import util from 'node:util';
import pc from 'picocolors';

export const cursorRulesLogLevels = {
  SILENT: -1, // No output
  ERROR: 0, // error
  WARN: 1, // warn
  INFO: 2, // success, info, log, note
  DEBUG: 3, // debug, trace
} as const;

export type CursorRulesLogLevel = (typeof cursorRulesLogLevels)[keyof typeof cursorRulesLogLevels];

class CursorRulesLogger {
  private level: CursorRulesLogLevel = cursorRulesLogLevels.INFO;

  constructor() {
    this.init();
  }

  init() {
    this.setLogLevel(cursorRulesLogLevels.INFO);
  }

  setLogLevel(level: CursorRulesLogLevel) {
    this.level = level;
  }

  getLogLevel(): CursorRulesLogLevel {
    return this.level;
  }

  error(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.ERROR) {
      console.error(pc.red(this.formatArgs(args)));
    }
  }

  warn(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.WARN) {
      console.log(pc.yellow(this.formatArgs(args)));
    }
  }

  success(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.INFO) {
      console.log(pc.green(this.formatArgs(args)));
    }
  }

  info(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.INFO) {
      console.log(pc.cyan(this.formatArgs(args)));
    }
  }

  log(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.INFO) {
      console.log(this.formatArgs(args));
    }
  }

  note(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.INFO) {
      console.log(pc.dim(this.formatArgs(args)));
    }
  }

  debug(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.DEBUG) {
      console.log(pc.blue(this.formatArgs(args)));
    }
  }

  trace(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.DEBUG) {
      console.log(pc.gray(this.formatArgs(args)));
    }
  }

  private formatArgs(args: unknown[]): string {
    return args
      .map((arg) => (typeof arg === 'object' ? util.inspect(arg, { depth: null, colors: true }) : arg))
      .join(' ');
  }
}

export const logger = new CursorRulesLogger();

export const setLogLevel = (level: CursorRulesLogLevel) => {
  logger.setLogLevel(level);
};