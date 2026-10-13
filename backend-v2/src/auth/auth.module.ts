import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { RedisModule } from 'src/redis/redis.module';
import { OtpModule } from 'src/otp/otp.module';
import { EmailModule } from 'src/email/email.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    RedisModule,
    OtpModule,
    EmailModule,
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
