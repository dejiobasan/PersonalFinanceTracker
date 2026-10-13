import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message:
      'Password must contain at least one letter and one number, and be at least 8 characters long',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only numbers' })
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userImage?: string;
}

export class RegisterResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'User data',
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
    userImage: string;
    phoneNumber: string;
    isVerified: boolean;
    role: string;
  };
  @ApiProperty()
  timestamp: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'User data',
    example: {
      userId: '12345678-1234-1234-1234-123456789012',
      email: 'john.doe@example.com',
      name: 'John Doe',
      userImage: 'https://example.com/user-image.jpg',
      isVerified: true,
      phoneNumber: '1234567890',
      role: 'USER',
      accessToken: 'bjbfhfhv',
      refreshToken: 'bjbfhfhv',
    },
  })
  data: {
    userId: string;
    email: string;
    name: string;
    userImage: string;
    isVerified: boolean;
    phoneNumber: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  };
  @ApiProperty()
  timestamp: string;
}

export class RefreshResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'User Data',
    example: {
      userId: '12345678-1234-1234-1234-123456789012',
      email: 'john.doe@example.com',
      name: 'John Doe',
      userImage: 'https://example.com/user-image.jpg',
      isVerified: true,
      phoneNumber: '1234567890',
      role: 'USER',
      accessToken: 'bjbfhfhv',
      refreshToken: 'bjbfhfhv',
    },
  })
  data: {
    userId: string;
    email: string;
    name: string;
    userImage: string;
    isVerified: boolean;
    phoneNumber: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  };
  @ApiProperty()
  timestamp: string;
}

export class verifyEmailDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    enum: ['email_verification', 'forgot_password'],
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    description: 'User data',
    example: {
      email: 'john.doe@example.com',
      isVerified: true,
    },
  })
  data: {
    email: string;
    isVerified: boolean;
  };
  @ApiProperty()
  timestamp: string;
}

export class LogoutResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  timestamp: string;
}

export class changePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class changePasswordResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  timestamp: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  timestamp: string;
}

export class ResendOtpDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    enum: ['email_verification', 'forgot_password'],
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class ResendOtpResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  timestamp: string;
}
