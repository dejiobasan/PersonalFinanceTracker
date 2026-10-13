import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmailModule } from './email/email.module';
import { OtpModule } from './otp/otp.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TransactionModule } from './transaction/transaction.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    RedisModule,
    CloudinaryModule,
    EmailModule,
    OtpModule,
    ThrottlerModule.forRoot([
      {
        name: 'otp',
        ttl: 300000,
        limit: 3,
      },
    ]),
    TransactionModule,
    AnalyticsModule,
    UsersModule,
  ],
})
export class AppModule {}
