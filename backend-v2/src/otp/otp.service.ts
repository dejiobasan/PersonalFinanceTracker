import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}
  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
      throw new BadRequestException('Invalid OTP');
    }
    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    });
    return true;
  }
}
