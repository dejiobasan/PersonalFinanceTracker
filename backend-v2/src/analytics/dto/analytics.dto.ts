import { ApiProperty } from '@nestjs/swagger';

export class AdminAnalyticsDataDto {
  @ApiProperty({ example: 120 })
  totalUsers: number;

  @ApiProperty({ example: 340 })
  totalDebitTransactions: number;

  @ApiProperty({ example: 210 })
  totalCreditTransactions: number;

  @ApiProperty({ example: 1520.75 })
  averageTransactionAmount: number;
}

export class AdminAnalyticsResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Admin analytics retrieved successfully' })
  message: string;

  @ApiProperty({
    type: () => AdminAnalyticsDataDto,
    description: 'Platform-wide analytics',
  })
  data: AdminAnalyticsDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class UserAnalyticsDataDto {
  @ApiProperty({ example: 15 })
  totalUserTransactions: number;

  @ApiProperty({ example: 6 })
  totalUserCreditTransactions: number;

  @ApiProperty({ example: 9 })
  totalUserDebitTransactions: number;

  @ApiProperty({ example: 980.5 })
  averageUserTransactionAmount: number;
}

export class UserAnalyticsResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'User analytics retrieved successfully' })
  message: string;

  @ApiProperty({
    type: () => UserAnalyticsDataDto,
    description: 'Analytics for the logged in user',
  })
  data: UserAnalyticsDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}
