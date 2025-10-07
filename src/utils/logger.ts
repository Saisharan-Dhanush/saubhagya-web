/**
 * Logger Utility - Simple wrapper for conditional logging
 * Only logs in development mode
 */

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  error: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.error('[ERROR]', ...args);
    }
  },

  warn: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },

  info: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },

  debug: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  }
};

export default logger;
