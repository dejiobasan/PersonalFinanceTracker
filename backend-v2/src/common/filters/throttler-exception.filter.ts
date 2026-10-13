import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: 'Too many OTP requests. Please wait before trying again.',
      retryAfter: 300000,
      timestamp: new Date().toISOString(),
    });
  }
}