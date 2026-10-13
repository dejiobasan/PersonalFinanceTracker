import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  providers: [OtpService],
  exports: [OtpService],
  imports: [PrismaModule],
})
export class OtpModule {}
