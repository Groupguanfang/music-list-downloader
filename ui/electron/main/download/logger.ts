import { createLogger, format, transports } from 'winston'

export function useLogger(level: string = 'silly') {
  const logger = createLogger({
    level,

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
