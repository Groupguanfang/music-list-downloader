import { createLogger, format, transports } from 'winston'

export function useLogger() {
  const logger = createLogger({
    level: 'debug',

    transports: [
      new transports.File({
        filename: 'winston.log',
        dirname: './config/cache',
        format: format.combine(
          format.timestamp(),
          format.json(),
        ),
      }),

      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple(),
        ),
      }),
    ],
  })

  return { logger }
}
