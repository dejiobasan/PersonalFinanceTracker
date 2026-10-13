import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProfileDto, UsersQueryDto } from './dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /** Cloudinary public id = path after `/upload/[v123/]` without extension. */
  private extractPublicId(url: string | null): string | null {
    if (!url) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
  }

  private async removeImageQuietly(url: string | null) {
    const publicId = this.extractPublicId(url);
    if (!publicId) return;
    try {
      await this.cloudinaryService.deleteImage(publicId);
    } catch {
      this.logger.warn(`Could not delete image ${publicId}`);
    }
  }

  async getAllUsers(query: UsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = query.name
      ? { name: { contains: query.name, mode: 'insensitive' as const } }
      : {};
    try {
      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,
          select: {
            userId: true,
            name: true,
            email: true,
            userImage: true,
            phoneNumber: true,
            isVerified: true,
            role: true,
            createdAt: true,
            _count: { select: { transactions: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.user.count({ where }),
      ]);
      return {
        message: 'Users retrieved successfully',
        data: {
          items: users.map(({ _count, ...user }) => ({
            ...user,
            totalTransactions: _count.transactions,
          })),
          meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        },
      };
    } catch (error) {
      this.logger.error(
        'Failed to retrieve users',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async deleteUser(adminId: string, userId: string) {
    if (adminId === userId) {
      throw new BadRequestException('You cannot delete your own account');
    }
    try {
      const user = await this.prisma.user.findUnique({ where: { userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const [transactions, otps] = await this.prisma.$transaction([
        this.prisma.transaction.deleteMany({ where: { userId } }),
        this.prisma.otp.deleteMany({ where: { userId } }),
        this.prisma.user.delete({ where: { userId } }),
      ]);
      await this.removeImageQuietly(user.userImage);
      return {
        message: 'User and all related records deleted successfully',
        data: { deletedTransactions: transactions.count, deletedOtps: otps.count },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        'Failed to delete user',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const { name, userImage, phoneNumber } = dto;
    if (name === undefined && userImage === undefined && phoneNumber === undefined) {
      throw new BadRequestException(
        'Provide at least one of name, userImage or phoneNumber',
      );
    }
    try {
      const existing = await this.prisma.user.findUnique({ where: { userId } });
      if (!existing) {
        throw new NotFoundException('User not found');
      }
      const imageUrl =
        userImage !== undefined
          ? await this.cloudinaryService.uploadImage(userImage)
          : undefined;
      const updated = await this.prisma.user.update({
        where: { userId },
        data: {
          ...(name !== undefined && { name }),
          ...(phoneNumber !== undefined && { phoneNumber }),
          ...(imageUrl !== undefined && { userImage: imageUrl }),
        },
      });
      if (imageUrl !== undefined) {
        await this.removeImageQuietly(existing.userImage);
      }
      return {
        message: 'Profile updated successfully',
        data: {
          userId: updated.userId,
          email: updated.email,
          name: updated.name,
          userImage: updated.userImage,
          phoneNumber: updated.phoneNumber,
          isVerified: updated.isVerified,
          role: updated.role,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        'Failed to update profile',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Failed to update profile');
    }
  }
}
