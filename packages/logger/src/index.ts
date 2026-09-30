import { createLogger, createHttpLogger } from "./logger";

export * from "./logger";
export * from "./redact";
export { default as pino } from "pino";
export type { Logger, LoggerOptions, Level } from "pino";
export type { HttpLogger, Options as HttpLoggerOptions } from "pino-http";

// Default ready-to-use logger instance, also carrying helper factories
export const logger = Object.assign(
  createLogger({ service: process.env.SERVICE_NAME ?? "backend" }),
  {
    createLogger,
    createHttpLogger,
  }
);

export default logger;