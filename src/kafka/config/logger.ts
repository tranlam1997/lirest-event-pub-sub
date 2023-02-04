import { logLevel } from "kafkajs"
import winston from "winston"

const toWinstonLogLevel = (level: number) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error'
    case logLevel.WARN:
      return 'warn'
    case logLevel.INFO:
      return 'info'
    case logLevel.DEBUG:
      return 'debug'
  }
}

export const WinstonLogCreator = (logLevel: number) => {
  const logger = winston.createLogger({
    level: toWinstonLogLevel(logLevel),
    transports: [
      new winston.transports.Console(),
    ]
  })

  return ({ namespace, level, label, log }) => {
    const { message, ...extra } = log
    logger.log({
      level: toWinstonLogLevel(level),
      message,
      extra,
    })
  }
}