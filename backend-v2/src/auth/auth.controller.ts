import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RegisterResponseDto,
  LoginResponseDto,
  RefreshResponseDto,
  VerifyEmailResponseDto,
  verifyEmailDto,
  ForgotPasswordDto,
  changePasswordDto,
  ResetPasswordDto,
  ResendOtpDto,
  ResendOtpResponseDto,
  LogoutResponseDto
} from './dto';
import {
  ErrorResponseDto,
  ThrottlerErrorResponseDto,
} from 'src/common/dtos/errorRes.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { JwtGuard } from './guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';
import { OtpThrottlerGuard } from './guard/throttler.guard';

@ApiTags('auth')
@Controller('auth')
@UseGuards(OtpThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Refresh access token',
  })
  @ApiOkResponse({
    description: 'Access token successfully refreshed',
    type: RefreshResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @ApiBearerAuth()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify email',
    description: 'Verify email',
  })
  @ApiOkResponse({
    description: 'Email verification successful',
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async verifyEmail(@Body() dto: verifyEmailDto) {
    return this.authService.verifyEmailVerificationOtp(
      dto.email,
      dto.otp,
      dto.type,
    );
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register user',
    description: 'Register user',
  })
  @Throttle({ otp: { limit: 3, ttl: 300000 } })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 409, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @ApiResponse({ status: 429, type: ThrottlerErrorResponseDto })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Login user',
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password',
    description: 'Forgot password',
  })
  @Throttle({ otp: { limit: 3, ttl: 300000 } })
  @ApiOkResponse({
    description: 'Password reset email sent successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 409, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @ApiResponse({ status: 429, type: ThrottlerErrorResponseDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset password',
  })
  @ApiOkResponse({
    description: 'Password reset successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post('change-password')
  @ApiOperation({
    summary: 'Change password',
    description: 'Change password',
  })
  @ApiOkResponse({
    description: 'Password changed successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 409, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async changePassword(@Body() dto: changePasswordDto, @Req() req: Request) {
    return this.authService.changePassword((req as any).user.userId, dto);
  }

  @Post('resend-otp')
  @ApiOperation({
    summary: 'Resend otp',
    description: 'Resend otp',
  })
  @Throttle({ otp: { limit: 3, ttl: 300000 } })
  @ApiOkResponse({
    description: 'Otp sent successfully',
    type: ResendOtpResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @ApiResponse({ status: 429, type: ThrottlerErrorResponseDto })
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user data',
    description: 'Get user data',
  })
  @ApiOkResponse({
    description: 'User data',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get('me')
  getMe(
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
        name: string;
        userImage: string;
        isVerified: boolean;
        phoneNumber: string;
        role: string;
      };
    },
  ) {
    return req.user;
  }

  @ApiOperation({
    summary: 'Logout user',
    description: 'Logout user',
  })
  @ApiOkResponse({
    description: 'User logged out successfully',
    type: LogoutResponseDto,
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(res);
  }
}
