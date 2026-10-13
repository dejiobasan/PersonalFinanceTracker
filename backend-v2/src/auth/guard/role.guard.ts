import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../../generated/prisma/enums';

interface AuthenticatedUser {
  userId: string;
  role?: Role;
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();

    if (request.user?.role !== Role.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
    return true;
  }
}
