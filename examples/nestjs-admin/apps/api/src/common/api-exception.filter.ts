import { ArgumentsHost, BadRequestException, Catch, HttpException, Logger, type ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { AppError } from './errors.js';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<{ id?: string }>();
    const requestId = request.id;

    if (exception instanceof AppError) {
      response.status(exception.statusCode).json({ error: { code: exception.code, message: exception.message, ...(requestId ? { requestId } : {}), ...(exception.fields ? { fields: exception.fields } : {}) } });
      return;
    }
    if (exception instanceof BadRequestException) {
      response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Check the submitted fields and try again.', ...(requestId ? { requestId } : {}) } });
      return;
    }
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({ error: { code: exception.getStatus() === 404 ? 'NOT_FOUND' : 'HTTP_ERROR', message: exception.message, ...(requestId ? { requestId } : {}) } });
      return;
    }

    this.logger.error('Unhandled request error', exception instanceof Error ? exception.stack : undefined);
    response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'The service could not complete the request.', ...(requestId ? { requestId } : {}) } });
  }
}
