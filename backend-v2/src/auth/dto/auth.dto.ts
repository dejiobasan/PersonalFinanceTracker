import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message:
      'Password must contain at least one letter and one number, and be at least 8 characters long',
  })
  @ApiProperty({ example: 'Password123' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only numbers' })
  @ApiProperty({ example: '1234567890' })
  phoneNumber: string;

  @ApiProperty({ required: false, example: 'https://example.com/user-image.jpg' })
  @IsString()
  @IsOptional()
  userImage?: string;
}

export class RegisterUserDataDto {
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
  userImage?: string | null;

  @ApiProperty({ example: '1234567890' })
  phoneNumber: string;

  @ApiProperty({ example: false })
  isVerified: boolean;

  @ApiProperty({ example: 'USER' })
  role: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({
    example:
      'User registered successfully, check your email to verify your account',
  })
  message: string;

  @ApiProperty({
    type: () => RegisterUserDataDto,
    description: 'User registration data',
  })
  data: RegisterUserDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Password123' })
  password: string;
}

export class AuthSessionDataDto {
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
  userImage?: string | null;

  @ApiProperty({ example: true })
  isVerified: boolean;

  @ApiProperty({ example: '1234567890' })
  phoneNumber: string;

  @ApiProperty({ example: 'USER' })
  role: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class LoginDataDto extends AuthSessionDataDto {}
export class RefreshDataDto extends AuthSessionDataDto {}

export class LoginResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'User logged in successfully' })
  message: string;

  @ApiProperty({
    type: () => AuthSessionDataDto,
    description: 'Authenticated session data',
  })
  data: AuthSessionDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class RefreshResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Access token refreshed successfully' })
  message: string;

  @ApiProperty({
    type: () => AuthSessionDataDto,
    description: 'Refreshed session data',
  })
  data: AuthSessionDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class verifyEmailDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    enum: ['email_verification'],
    example: 'email_verification',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['email_verification'])
  type: string;
}

export class VerifyEmailDataDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: true })
  isVerified: boolean;
}

export class VerifyEmailResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Email verification successful' })
  message: string;

  @ApiProperty({
    type: () => VerifyEmailDataDto,
    description: 'Verified email data',
  })
  data: VerifyEmailDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Logout successful' })
  message: string;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class changePasswordDto {
  @ApiProperty({ example: 'OldPassword123' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'NewPassword123' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'NewPassword123' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class changePasswordResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Password changed successfully' })
  message: string;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Password reset successfully' })
  message: string;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Password reset email sent successfully' })
  message: string;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class ResendOtpDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: ['email_verification', 'forgot_password'],
    example: 'email_verification',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['email_verification', 'forgot_password'])
  type: string;
}

export class ResendOtpResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Otp sent successfully' })
  message: string;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}

export class GetMeResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'User data retrieved successfully' })
  message: string;

  @ApiProperty({
    type: () => RegisterUserDataDto,
    description: 'Current user profile data',
  })
  data: RegisterUserDataDto;

  @ApiProperty({ example: '2026-10-14T07:52:48.000Z' })
  timestamp: string;
}
