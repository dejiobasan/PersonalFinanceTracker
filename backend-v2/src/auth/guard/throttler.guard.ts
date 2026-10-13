import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OtpThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email ?? 'unknown';
    const ip = req.ip;
    return `${email}-${ip}`;
  }
}