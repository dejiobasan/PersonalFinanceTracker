import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OtpThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const ip = req.ips?.length ? req.ips[0] : req.ip;
    return ip ?? 'unknown';
  }

  protected generateKey(
    context: ExecutionContext,
    suffix: string,
    name: string,
  ): string {
    if (name === 'email' || name === 'account') {
      const req = context.switchToHttp().getRequest();
      const email = req.body?.email;
      if (email) {
        return super.generateKey(context, email, name);
      }
    }
    return super.generateKey(context, suffix, name);
  }
}
