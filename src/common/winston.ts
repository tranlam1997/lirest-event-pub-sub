import winston from 'winston';

const { combine, timestamp, printf, json, colorize } = winston.format;
const formatInfo = printf(({ level, message, ...metadata }) => {
  const { timestamp, serviceName, ...rest } = metadata;
  return `[${metadata.serviceName}] level: ${level}, message: ${message}, timestamp: ${
    metadata.timestamp
  }, data: ${JSON.stringify(rest)}.`;
});
const baseLoggerConfig = {
  format: combine(timestamp(), formatInfo, colorize({ all: true })),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false,
} as winston.LoggerOptions;

export const logger = (serviceName: string) => {
  return winston.createLogger(baseLoggerConfig).child({ serviceName });
};
