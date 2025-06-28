import { intro, log, outro } from '@clack/prompts';
import util from 'node:util';
import pc from 'picocolors';

export const cursorRulesLogLevels = {
  FORCE: -1, // always show output
  SILENT: 0, // No output
  ERROR: 1, // error
  WARN: 2, // warn
  INFO: 3, // success, info, log, note
  DEBUG: 4, // debug, trace
} as const;

export type CursorRulesLogLevel =
  (typeof cursorRulesLogLevels)[keyof typeof cursorRulesLogLevels];

class CursorRulesLogger {
  private level: CursorRulesLogLevel = cursorRulesLogLevels.INFO;

  constructor() {
    this.init();
  }

  init() {
    this.setLogLevel(cursorRulesLogLevels.INFO);
  }

  prompt = {
    intro: (...args: unknown[]) => {
      if (this.level >= cursorRulesLogLevels.INFO) {
        intro(pc.bold(this.formatArgs(args)));
      }
    },
    error: (...args: unknown[]) => {
      if (this.level >= cursorRulesLogLevels.ERROR) {
        log.error(this.formatArgs(args));
      }
    },
    info: (...args: unknown[]) => {
      if (this.level >= cursorRulesLogLevels.INFO) {
        log.info(this.formatArgs(args));
      }
    },
    message: (...args: unknown[]) => {
      if (this.level >= cursorRulesLogLevels.INFO) {
        log.message(this.formatArgs(args));
      }
    },
    step: (...args: unknown[]) => {
      if (this.level >= cursorRulesLogLevels.INFO) {
        log.step(this.formatArgs(args));
      }
    },
    success: (...args: unknown[]) => {
      if (this.level >= cursorRulesLogLevels.INFO) {
        log.success(this.formatArgs(args));
      }
    },
    warn: (...args: unknown[]) => {
      if (this.level >= cursorRulesLogLevels.WARN) {
        log.warn(this.formatArgs(args));
      }
    },
    outro: (...args: unknown[]) => {
      if (this.level >= cursorRulesLogLevels.INFO) {
        outro(pc.bold(this.formatArgs(args)));
      }
    },
    outroForce: (...args: unknown[]) => {
      if (this.level >= cursorRulesLogLevels.FORCE) {
        outro(pc.bold(this.formatArgs(args)));
      }
    },
  };

  setLogLevel(level: CursorRulesLogLevel) {
    this.level = level;
  }

  getLogLevel(): CursorRulesLogLevel {
    return this.level;
  }

  error(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.ERROR) {
      console.error(' ', pc.red(this.formatArgs(args)));
    }
  }

  warn(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.WARN) {
      console.log(' ', pc.yellow(this.formatArgs(args)));
    }
  }

  success(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.INFO) {
      console.log(' ', pc.green(this.formatArgs(args)));
    }
  }

  info(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.INFO) {
      console.log(' ', pc.cyan(this.formatArgs(args)));
    }
  }

  log(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.INFO) {
      console.log(' ', this.formatArgs(args));
    }
  }

  note(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.INFO) {
      console.log(' ', pc.dim(this.formatArgs(args)));
    }
  }

  debug(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.DEBUG) {
      console.log(' ', pc.blue(this.formatArgs(args)));
    }
  }

  trace(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.DEBUG) {
      console.log(' ', pc.gray(this.formatArgs(args)));
    }
  }

  quiet(...args: unknown[]) {
    if (this.level <= cursorRulesLogLevels.SILENT) {
      console.log(' ', pc.dim(this.formatArgs(args)));
    }
  }

  force(...args: unknown[]) {
    if (this.level >= cursorRulesLogLevels.FORCE) {
      console.log(' ', this.formatArgs(args));
    }
  }

  private formatArgs(args: unknown[]): string {
    return args
      .map((arg) =>
        typeof arg === 'object'
          ? util.inspect(arg, { depth: null, colors: true })
          : arg
      )
      .join(' ');
  }
}

export const logger = new CursorRulesLogger();

export const setLogLevel = (level: CursorRulesLogLevel) => {
  logger.setLogLevel(level);
};
