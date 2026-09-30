import pino, { type Logger, type LoggerOptions } from "pino";
import pinoHttp, { type HttpLogger, type Options as PinoHttpOptions } from "pino-http";
import { ALWAYS_REDACT, PROD_ONLY_REDACT } from "./redact";
import { config } from "./config/config";

export interface CreateLoggerOptions {
    service: string;
    level?: string;
    env?: string;
    redact?: string[];
    options?: Partial<LoggerOptions>;
}

export function createLogger({
    service,
    level,
    env,
    redact = [],
    options: customOptions,
}: CreateLoggerOptions): Logger {

    const currentEnv = env ?? process.env.NODE_ENV ?? config.env;
    const currentLogLevel = level ?? process.env.LOG_LEVEL ?? config.logLevel;
    const isProduction = currentEnv === "production";

    const defaultRedactPaths = isProduction
        ? [...ALWAYS_REDACT, ...PROD_ONLY_REDACT]
        : ALWAYS_REDACT;

    const options: LoggerOptions = {
        ...customOptions,
        level: currentLogLevel,
        base: { service, env: currentEnv },
        redact: {
            paths: [...defaultRedactPaths, ...redact],
            censor: "[REDACTED]",
        },
    };

    if (isProduction) {
        options.timestamp = options.timestamp ?? pino.stdTimeFunctions.isoTime;
        options.formatters = options.formatters ?? {
            level: (label) => ({ level: label }),
        };
    } else {
        options.transport = options.transport ?? {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss",
                ignore: "pid,hostname,service,env",
            },
        };
    }

    return pino(options);
}

export function createHttpLogger(
    serviceOrLogger: string | Logger,
    options?: PinoHttpOptions
): HttpLogger {
    const loggerInstance =
        typeof serviceOrLogger === "string"
            ? createLogger({ service: serviceOrLogger })
            : serviceOrLogger;

    return pinoHttp({
        logger: loggerInstance,

        serializers: {
            req: (req) => ({
                id: req.id,
                method: req.method,
                url: req.url,
            }),

            res: (res) => ({
                statusCode: res.statusCode,
            }),
        },

        ...options,
    });
}