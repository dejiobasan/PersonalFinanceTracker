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

export class UserListItemDto {
  @ApiProperty({ example: '12345678-1234-1234-1234-123456789012' })
  userId: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/user-image.jpg',
    required: false,
    nullable: true,
  })
  userImage: string | null;

  @ApiProperty({ example: '1234567890' })
  phoneNumber: string;

  @ApiProperty({ example: true })
  isVerified: boolean;

  @ApiProperty({ example: 'USER' })
  role: string;

  @ApiProperty({ example: '2026-10-13T19:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 15 })
  totalTransactions: number;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

export class UsersListDataDto {
  @ApiProperty({
    type: () => [UserListItemDto],
    description: 'List of users',
  })
  items: UserListItemDto[];

  @ApiProperty({
    type: () => PaginationMetaDto,
    description: 'Pagination metadata',
  })
  meta: PaginationMetaDto;
}

export class UsersListResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Users fetched successfully' })
  message: string;

  @ApiProperty({
    type: () => UsersListDataDto,
    description: 'Paginated users with their transaction counts',
  })
  data: UsersListDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
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

export class UserProfileDataDto {
  @ApiProperty({ example: '12345678-1234-1234-1234-123456789012' })
  userId: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/user-image.jpg',
    required: false,
    nullable: true,
  })
  userImage: string | null;

  @ApiProperty({ example: '1234567890' })
  phoneNumber: string;

  @ApiProperty({ example: true })
  isVerified: boolean;

  @ApiProperty({ example: 'USER' })
  role: string;
}

export class UpdateProfileResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Profile updated successfully' })
  message: string;

  @ApiProperty({
    type: () => UserProfileDataDto,
    description: 'Updated user data',
  })
  data: UserProfileDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class DeleteUserDataDto {
  @ApiProperty({ example: 12 })
  deletedTransactions: number;

  @ApiProperty({ example: 2 })
  deletedOtps: number;
}

export class DeleteUserResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'User deleted successfully' })
  message: string;

  @ApiProperty({
    type: () => DeleteUserDataDto,
    description: 'Number of records removed',
  })
  data: DeleteUserDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}
