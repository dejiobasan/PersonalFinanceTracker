import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UsersQueryDto {
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

  @ApiPropertyOptional({ description: 'Search by user name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class UsersListResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'Paginated users with their transaction counts',
    example: {
      items: [
        {
          userId: '12345678-1234-1234-1234-123456789012',
          name: 'John Doe',
          email: 'john.doe@example.com',
          userImage: 'https://example.com/user-image.jpg',
          phoneNumber: '1234567890',
          isVerified: true,
          role: 'USER',
          createdAt: '2026-10-13T19:00:00.000Z',
          totalTransactions: 15,
        },
      ],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    },
  })
  data: {
    items: {
      userId: string;
      name: string;
      email: string;
      userImage: string | null;
      phoneNumber: string;
      isVerified: boolean;
      role: string;
      createdAt: Date;
      totalTransactions: number;
    }[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  };
  @ApiProperty()
  timestamp: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Image URL or base64 data URI; uploaded to Cloudinary',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userImage?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only numbers' })
  phoneNumber?: string;
}

export class UpdateProfileResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'Updated user data',
    example: {
      userId: '12345678-1234-1234-1234-123456789012',
      email: 'john.doe@example.com',
      name: 'John Doe',
      userImage: 'https://example.com/user-image.jpg',
      phoneNumber: '1234567890',
      isVerified: true,
      role: 'USER',
    },
  })
  data: {
    userId: string;
    email: string;
    name: string;
    userImage: string | null;
    phoneNumber: string;
    isVerified: boolean;
    role: string;
  };
  @ApiProperty()
  timestamp: string;
}

export class DeleteUserResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'Number of records removed',
    example: { deletedTransactions: 12, deletedOtps: 2 },
  })
  data: { deletedTransactions: number; deletedOtps: number };
  @ApiProperty()
  timestamp: string;
}
