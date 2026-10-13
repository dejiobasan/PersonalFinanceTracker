import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ErrorResponseDto } from 'src/common/dtos/errorRes.dto';
import { JwtGuard } from 'src/auth/guard';
import { AdminGuard } from 'src/auth/guard/role.guard';
import { AnalyticsService } from './analytics.service';
import { AdminAnalyticsResponseDto, UserAnalyticsResponseDto } from './dto';

type AuthRequest = Request & { user: { userId: string; role?: string } };

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Get platform analytics (admin)',
    description:
      'Admin only. Total users, total debit and credit transactions, and average transaction amount.',
  })
  @ApiOkResponse({ type: AdminAnalyticsResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async getAdminAnalytics() {
    return this.analyticsService.getAdminAnalytics();
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get my analytics',
    description:
      "Total, credit and debit transaction counts and average amount for the logged in user.",
  })
  @ApiOkResponse({ type: UserAnalyticsResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async getUserAnalytics(@Req() req: AuthRequest) {
    return this.analyticsService.getUserAnalytics(req.user.userId);
  }
}
