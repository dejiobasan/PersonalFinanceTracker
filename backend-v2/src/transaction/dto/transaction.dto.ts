import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TransactionType } from '../../generated/prisma/enums';

export class CreateTransactionDto {
  @ApiProperty({ example: 2500.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'Grocery shopping' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.DEBIT })
  @IsEnum(TransactionType)
  type: TransactionType;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}

export class AdminTransactionQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search by user name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;
}

const transactionExample = {
  transactionId: '12345678-1234-1234-1234-123456789012',
  userId: '12345678-1234-1234-1234-123456789012',
  amount: 2500.5,
  description: 'Grocery shopping',
  type: 'DEBIT',
  dateCreated: '2026-10-13T19:00:00.000Z',
};

const metaExample = { total: 1, page: 1, limit: 10, totalPages: 1 };

export class TransactionResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({ description: 'Transaction data', example: transactionExample })
  data: {
    transactionId: string;
    userId: string;
    amount: number;
    description: string;
    type: TransactionType;
    dateCreated: Date;
  };
  @ApiProperty()
  timestamp: string;
}

export class TransactionListResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'Paginated transactions',
    example: { items: [transactionExample], meta: metaExample },
  })
  data: {
    items: TransactionResponseDto['data'][];
    meta: { total: number; page: number; limit: number; totalPages: number };
  };
  @ApiProperty()
  timestamp: string;
}

export class DeleteTransactionResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    nullable: true,
    example: null,
  })
  data: null;
  @ApiProperty()
  timestamp: string;
}

export class DeleteAllTransactionsResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({ example: { deletedCount: 42 } })
  data: { deletedCount: number };
  @ApiProperty()
  timestamp: string;
}
