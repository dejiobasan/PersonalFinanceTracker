import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  changePasswordDto,
  ResetPasswordDto,
  ResendOtpDto,
} from './dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Request, Response } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
interface AuthCookies {
  access_token?: string;
  refresh_token?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async signToken(
    userId: string,
    email: string,
    role: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.REFRESH_SECRET,
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async verifyEmailVerificationOtp(
    email: string,
    otp: string,
    type: string,
  ): Promise<{
    success: boolean;
    statusCode: number;
    message: string;
    data: {
      email: string;
      isVerified: boolean;
    };
    timestamp: string;
  }> {
    try {
      if (type !== 'email_verification') {
        throw new BadRequestException('Invalid OTP type');
      }
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const res = await this.otpService.verifyOtp(
        user.userId,
        otp,
        'email_verification',
      );
      if (res) {
        await this.prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: {
              userId: user.userId,
            },
            data: {
              isVerified: true,
            },
          });
        });
      }
      return {
        success: true,
        statusCode: 200,
        message: 'Email verification successful',
        data: {
          email,
          isVerified: true,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to verify email');
    }
  }

  async register(dto: RegisterDto, res: Response) {
    const { name, email, password, userImage, phoneNumber } = dto;
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (user) {
        throw new ConflictException('User already exists');
      }
      const saltRounds = Number(process.env.SALT_ROUNDS ?? 12);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const imageUrl = userImage
        ? await this.cloudinaryService.uploadImage(userImage)
        : null;
      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          userImage: imageUrl,
          phoneNumber,
        },
      });
      const otp = await this.otpService.createOtp(
        newUser.userId,
        'email_verification',
      );
      this.emailService.sendOtpEmail(newUser.email, newUser.name, otp);
      return {
        message:
          'User registered successfully, check your email to verify your account',
        data: {
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
          userImage: newUser.userImage,
          isVerified: newUser.isVerified,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        'Failed to register user',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(dto: LoginDto, res: Response) {
    const { email, password } = dto;
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!foundUser) {
        throw new UnauthorizedException('User not found');
      }
      if (!foundUser.isVerified) {
        const otp = await this.otpService.createOtp(
          foundUser.userId,
          'email_verification',
        );
        this.emailService.sendOtpEmail(foundUser.email, foundUser.name, otp);
        throw new UnauthorizedException(
          'User is not verified. A new verification OTP has been sent to your email.',
        );
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        foundUser.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const tokens = await this.signToken(
        foundUser.userId,
        foundUser.email,
        foundUser.role,
      );
      const { access_token, refresh_token } = tokens;
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        message: 'User logged in successfully',
        data: {
          userId: foundUser.userId,
          email: foundUser.email,
          name: foundUser.name,
          userImage: foundUser.userImage,
          isVerified: foundUser.isVerified,
          phoneNumber: foundUser.phoneNumber,
          role: foundUser.role,
          accessToken: access_token,
          refreshToken: refresh_token,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed!');
    }
  }

  async logout(res: Response) {
    try {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return {
        message: 'Logout successful',
        data: null,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Logout failed!');
    }
  }

  async refresh(req: Request, res: Response) {
    const cookies = req.cookies as AuthCookies;
    const refreshToken = cookies.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });

      const foundUser = await this.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (!foundUser) throw new UnauthorizedException('User not found');

      const { access_token } = await this.signToken(
        payload.sub,
        payload.email,
        payload.role,
      );

      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      return {
        message: 'Access token refreshed successfully',
        data: {
          userId: foundUser.userId,
          email: foundUser.email,
          name: foundUser.name,
          userImage: foundUser.userImage,
          isVerified: foundUser.isVerified,
          phoneNumber: foundUser.phoneNumber,
          role: foundUser.role,
          accessToken: access_token,
          refreshToken,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const otp = await this.otpService.createOtp(
        user.userId,
        'forgot_password',
      );
      this.emailService.sendOtpEmail(user.email, user.name, otp);
      return {
        message: 'Password reset email sent successfully',
        data: null,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, otp, newPassword } = dto;
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.otpService.verifyOtp(user.userId, otp, 'forgot_password');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { userId: user.userId },
        data: { password: hashedPassword },
      });
      return {
        message: 'Password reset successfully',
        data: null,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  async changePassword(userId: string, dto: changePasswordDto) {
    const { oldPassword, newPassword } = dto;
    try {
      const user = await this.prisma.user.findUnique({ where: { userId } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid old password');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { userId },
        data: { password: hashedPassword },
      });
      return {
        message: 'Password changed successfully',
        data: null,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  async resendOtp(dto: ResendOtpDto) {
    try {
      if (
        dto.type !== 'email_verification' &&
        dto.type !== 'forgot_password'
      ) {
        throw new BadRequestException('Invalid OTP type');
      }
      const foundUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!foundUser) {
        throw new UnauthorizedException('User not found');
      }
      const otp = await this.otpService.createOtp(foundUser.userId, dto.type);
      this.emailService.sendOtpEmail(foundUser.email, foundUser.name, otp);
      return {
        message: 'Otp sent successfully',
        data: null,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to resend otp');
    }
  }
}
