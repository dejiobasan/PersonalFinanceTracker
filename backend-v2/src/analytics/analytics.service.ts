import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface TypeGroup {
  type: string;
  _count?: true | { _all?: number };
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private countFor(groups: TypeGroup[], type: 'CREDIT' | 'DEBIT'): number {
    const count = groups.find((g) => g.type === type)?._count;
    return typeof count === 'object' ? (count._all ?? 0) : 0;
  }

  private round(value: unknown): number {
    return Math.round(Number(value ?? 0) * 100) / 100;
  }

  async getAdminAnalytics() {
    try {
      const [totalUsers, groups, aggregate] = await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.transaction.groupBy({
          by: ['type'],
          _count: { _all: true },
          orderBy: { type: 'asc' },
        }),
        this.prisma.transaction.aggregate({ _avg: { amount: true } }),
      ]);
      return {
        message: 'Analytics retrieved successfully',
        data: {
          totalUsers,
          totalDebitTransactions: this.countFor(groups, 'DEBIT'),
          totalCreditTransactions: this.countFor(groups, 'CREDIT'),
          averageTransactionAmount: this.round(aggregate._avg.amount),
        },
      };
    } catch {
      throw new InternalServerErrorException('Failed to retrieve analytics');
    }
  }

  async getUserAnalytics(userId: string) {
    try {
      const [groups, aggregate] = await this.prisma.$transaction([
        this.prisma.transaction.groupBy({
          by: ['type'],
          where: { userId },
          _count: { _all: true },
          orderBy: { type: 'asc' },
        }),
        this.prisma.transaction.aggregate({
          where: { userId },
          _avg: { amount: true },
        }),
      ]);
      const credit = this.countFor(groups, 'CREDIT');
      const debit = this.countFor(groups, 'DEBIT');
      return {
        message: 'Analytics retrieved successfully',
        data: {
          totalUserTransactions: credit + debit,
          totalUserCreditTransactions: credit,
          totalUserDebitTransactions: debit,
          averageUserTransactionAmount: this.round(aggregate._avg.amount),
        },
      };
    } catch {
      throw new InternalServerErrorException('Failed to retrieve analytics');
    }
  }
}
