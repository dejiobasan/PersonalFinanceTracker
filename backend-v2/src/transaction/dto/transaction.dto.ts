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

export class TransactionDataDto {
  @ApiProperty({ example: '12345678-1234-1234-1234-123456789012' })
  transactionId: string;

  @ApiProperty({ example: '12345678-1234-1234-1234-123456789012' })
  userId: string;

  @ApiProperty({ example: 2500.5 })
  amount: number;

  @ApiProperty({ example: 'Grocery shopping' })
  description: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.DEBIT })
  type: TransactionType;

  @ApiProperty({ example: '2026-10-13T19:00:00.000Z' })
  dateCreated: Date;
}

export class TransactionResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Transaction retrieved successfully' })
  message: string;

  @ApiProperty({
    type: () => TransactionDataDto,
    description: 'Transaction data',
  })
  data: TransactionDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class TransactionPaginationMetaDto {
  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

export class TransactionListDataDto {
  @ApiProperty({
    type: () => [TransactionDataDto],
    description: 'List of transactions',
  })
  items: TransactionDataDto[];

  @ApiProperty({
    type: () => TransactionPaginationMetaDto,
    description: 'Pagination metadata',
  })
  meta: TransactionPaginationMetaDto;
}

export class TransactionListResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Transactions retrieved successfully' })
  message: string;

  @ApiProperty({
    type: () => TransactionListDataDto,
    description: 'Paginated transactions',
  })
  data: TransactionListDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class DeleteTransactionResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Transaction deleted successfully' })
  message: string;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class DeleteAllTransactionsDataDto {
  @ApiProperty({ example: 42 })
  deletedCount: number;
}

export class DeleteAllTransactionsResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'All transactions deleted successfully' })
  message: string;

  @ApiProperty({
    type: () => DeleteAllTransactionsDataDto,
    description: 'Deletion summary',
  })
  data: DeleteAllTransactionsDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}
