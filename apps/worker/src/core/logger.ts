/** Structured, JSON-lines logger compatible with Cloudflare Workers Logs. */

export type LogValue = string | number | boolean | null | undefined;

export interface LogFields {
  readonly [key: string]: LogValue;
}

export interface Logger {
  info(message: string, fields?: LogFields): void;
  warn(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
}

const emit = (level: 'info' | 'warn' | 'error', message: string, fields?: LogFields): void => {
  const payload = { level, message, ...fields };
  const serialized = JSON.stringify(payload);
  if (level === 'error') {
    console.error(serialized);
  } else if (level === 'warn') {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
};

export const createLogger = (): Logger => ({
  info: (message, fields) => emit('info', message, fields),
  warn: (message, fields) => emit('warn', message, fields),
  error: (message, fields) => emit('error', message, fields),
});
