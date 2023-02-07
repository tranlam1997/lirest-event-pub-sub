import winston from 'winston';

const { combine, timestamp, printf, json, colorize } = winston.format;
const formatInfo = printf(({ level, message, ...metadata }) => {
  const { timestamp, serviceName, namespace, ...rest } = <
    { timestamp: string | Date; serviceName: string; namespace: string; [k: string]: any }
  >metadata;
  return `[${serviceName}] [${namespace}] level: ${level}, message: ${message}, timestamp: ${
    metadata.timestamp
  }, data: ${JSON.stringify(rest)}.`;
});

export const baseLoggerConfig = (logLevel?: string) =>
  ({
    level: logLevel || 'debug',
    format: combine(timestamp(), formatInfo, colorize({ all: true })),
    transports: [
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        handleRejections: true,
      }),
    ],
    exitOnError: false,
  } as winston.LoggerOptions);
