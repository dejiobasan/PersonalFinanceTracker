import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { UsersService } from './users.service';
import {
  DeleteUserResponseDto,
  UpdateProfileDto,
  UpdateProfileResponseDto,
  UsersListResponseDto,
  UsersQueryDto,
} from './dto';

type AuthRequest = Request & { user: { userId: string; role?: string } };

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Get all users (admin)',
    description:
      'Admin only. Paginated list of users with their total transaction count, searchable by name.',
  })
  @ApiOkResponse({ type: UsersListResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async getAllUsers(@Query() query: UsersQueryDto) {
    return this.usersService.getAllUsers(query);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update my profile',
    description:
      'Update only the logged in user\'s name, image or phone number. At least one field is required.',
  })
  @ApiOkResponse({ type: UpdateProfileResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async updateProfile(@Req() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Delete a user (admin)',
    description:
      'Admin only. Permanently deletes the user, all of their transactions, OTPs and profile image. Admins cannot delete themselves.',
  })
  @ApiOkResponse({ type: DeleteUserResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async deleteUser(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.deleteUser(req.user.userId, id);
  }
}
