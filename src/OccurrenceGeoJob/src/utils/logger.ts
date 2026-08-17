import winston from 'winston';

function loggerFormat() {
  const format = process.env.LOGGER_FORMAT || 'console';

  if (format === 'json') {
    return winston.format.json();
  }

  return winston.format.combine(
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.simple(),
  );
}

function loggerTransport() {
  return new winston.transports.Console({
    format: loggerFormat(),
  });
}

const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`.trim();
    }),
  ),
  transports: [loggerTransport()],
});

export default logger;
