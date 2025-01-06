import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Nest doesn’t log Bad Request, 401 Unauthorized, nor 405 Method Not Allowed. This middleware does that
 */
@Injectable()
export class RequestLoggerMiddleWare implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode;
      if (
        statusCode == HttpStatus.BAD_REQUEST ||
        statusCode == HttpStatus.UNAUTHORIZED ||
        statusCode == HttpStatus.FORBIDDEN ||
        statusCode == HttpStatus.NOT_FOUND ||
        statusCode == HttpStatus.METHOD_NOT_ALLOWED
      ) {
        this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
      }
    });
    next();
  }
}
