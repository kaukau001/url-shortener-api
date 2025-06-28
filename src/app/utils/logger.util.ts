import { v4 as uuidv4 } from 'uuid';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  [key: string]: any;
}

export class Logger {
  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  private static formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = this.formatTimestamp();
    const requestId = context?.requestId || uuidv4();

    let formattedMessage = `[${timestamp}] [${requestId}] [${level}] ${message}`;

    if (context && Object.keys(context).length > 1) {
      const contextData = { ...context };
      delete contextData.requestId;
      formattedMessage += ` ${JSON.stringify(contextData)}`;
    }

    return formattedMessage;
  }

  static error(message: string, context?: LogContext, error?: Error): void {
    const formattedMessage = this.formatMessage(LogLevel.ERROR, message, context);

    if (error) {
      console.error(formattedMessage, {
        stack: error.stack,
        name: error.name,
        message: error.message,
      });
    } else {
      console.error(formattedMessage);
    }
  }

  static warn(message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(LogLevel.WARN, message, context);
    console.warn(formattedMessage);
  }

  static info(message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(LogLevel.INFO, message, context);
    console.log(formattedMessage);
  }

  static debug(message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, context);

    if (process.env.NODE_ENV === 'dev' || process.env.LOG_LEVEL === 'debug') {
      console.debug(formattedMessage);
    }
  }
}

export function createRequestLogger(requestId: string) {
  return {
    error: (message: string, additionalContext?: Omit<LogContext, 'requestId'>, error?: Error) =>
      Logger.error(message, { requestId, ...additionalContext }, error),

    warn: (message: string, additionalContext?: Omit<LogContext, 'requestId'>) =>
      Logger.warn(message, { requestId, ...additionalContext }),

    info: (message: string, additionalContext?: Omit<LogContext, 'requestId'>) =>
      Logger.info(message, { requestId, ...additionalContext }),

    debug: (message: string, additionalContext?: Omit<LogContext, 'requestId'>) =>
      Logger.debug(message, { requestId, ...additionalContext }),
  };
}
