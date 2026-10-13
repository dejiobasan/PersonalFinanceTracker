import { ApiProperty } from '@nestjs/swagger';

export class AdminAnalyticsResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'Platform-wide analytics',
    example: {
      totalUsers: 120,
      totalDebitTransactions: 340,
      totalCreditTransactions: 210,
      averageTransactionAmount: 1520.75,
    },
  })
  data: {
    totalUsers: number;
    totalDebitTransactions: number;
    totalCreditTransactions: number;
    averageTransactionAmount: number;
  };
  @ApiProperty()
  timestamp: string;
}

export class UserAnalyticsResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'Analytics for the logged in user',
    example: {
      totalUserTransactions: 15,
      totalUserCreditTransactions: 6,
      totalUserDebitTransactions: 9,
      averageUserTransactionAmount: 980.5,
    },
  })
  data: {
    totalUserTransactions: number;
    totalUserCreditTransactions: number;
    totalUserDebitTransactions: number;
    averageUserTransactionAmount: number;
  };
  @ApiProperty()
  timestamp: string;
}
