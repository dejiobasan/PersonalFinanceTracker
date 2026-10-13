import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  private readonly maxFailures = Number(process.env.OTP_MAX_FAILURES ?? 5);

  constructor(private prisma: PrismaService) {}
  private generateOtpCode(): string {
    return randomInt(100000, 1000000).toString();
  }
  async createOtp(userId: string, type: string) {
    const code = this.generateOtpCode();

    const hashedCode = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.otp.create({
      data: {
        code: hashedCode,
        type,
        userId,
        expiresAt,
      },
    });
    return code;
  }
  async verifyOtp(userId: string, inputCode: string, type: string) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        type,
        used: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!otp) {
      throw new BadRequestException('OTP not found');
    }
    if (otp.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }
    const isMatch = await bcrypt.compare(inputCode, otp.code);
    if (!isMatch) {
      const newAttempts = otp.attempts + 1;
      const isExceeded = newAttempts >= this.maxFailures;

      await this.prisma.otp.updateMany({
        where: { id: otp.id, used: false },
        data: {
          attempts: { increment: 1 },
          ...(isExceeded ? { used: true } : {}),
        },
      });

      if (isExceeded) {
        throw new BadRequestException(
          'Too many failed attempts. OTP has been invalidated',
        );
      }

      throw new BadRequestException('Invalid OTP');
    }

    const result = await this.prisma.otp.updateMany({
      where: {
        id: otp.id,
        used: false,
      },
      data: {
        used: true,
      },
    });

    if (result.count !== 1) {
      throw new BadRequestException('Invalid OTP');
    }

    return true;
  }
}
