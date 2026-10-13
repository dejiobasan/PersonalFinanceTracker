import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AdminTransactionQueryDto,
  CreateTransactionDto,
  PaginationQueryDto,
  UpdateTransactionDto,
} from './dto';

interface TransactionRecord {
  amount: { toString(): string } | number;
  [key: string]: unknown;
}

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  private serialize<T extends TransactionRecord>(transaction: T) {
    return { ...transaction, amount: Number(transaction.amount) };
  }

  private buildMeta(total: number, page: number, limit: number) {
    return { total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  private handleError(error: unknown, action: string): never {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException(`Failed to ${action}`);
  }

  private async findOwned(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { transactionId, userId },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async getAllTransactions(query: AdminTransactionQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = {
      ...(query.type && { type: query.type }),
      ...(query.name && {
        user: { name: { contains: query.name, mode: 'insensitive' as const } },
      }),
    };
    try {
      const [items, total] = await this.prisma.$transaction([
        this.prisma.transaction.findMany({
          where,
          include: { user: { select: { userId: true, name: true, email: true } } },
          orderBy: { dateCreated: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.transaction.count({ where }),
      ]);
      return {
        message: 'Transactions retrieved successfully',
        data: {
          items: items.map((t) => this.serialize(t)),
          meta: this.buildMeta(total, page, limit),
        },
      };
    } catch (error) {
      this.handleError(error, 'retrieve transactions');
    }
  }

  async deleteAllTransactions() {
    try {
      const { count } = await this.prisma.transaction.deleteMany();
      return {
        message: 'All transactions deleted successfully',
        data: { deletedCount: count },
      };
    } catch (error) {
      this.handleError(error, 'delete transactions');
    }
  }

  async getUserTransactions(userId: string, query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = { userId, ...(query.type && { type: query.type }) };
    try {
      const [items, total] = await this.prisma.$transaction([
        this.prisma.transaction.findMany({
          where,
          orderBy: { dateCreated: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.transaction.count({ where }),
      ]);
      return {
        message: 'Transactions retrieved successfully',
        data: {
          items: items.map((t) => this.serialize(t)),
          meta: this.buildMeta(total, page, limit),
        },
      };
    } catch (error) {
      this.handleError(error, 'retrieve transactions');
    }
  }

  async getUserTransactionById(userId: string, transactionId: string) {
    try {
      const transaction = await this.findOwned(userId, transactionId);
      return {
        message: 'Transaction retrieved successfully',
        data: this.serialize(transaction),
      };
    } catch (error) {
      this.handleError(error, 'retrieve transaction');
    }
  }

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    try {
      const transaction = await this.prisma.transaction.create({
        data: { ...dto, userId },
      });
      return {
        message: 'Transaction created successfully',
        data: this.serialize(transaction),
      };
    } catch (error) {
      this.handleError(error, 'create transaction');
    }
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ) {
    try {
      await this.findOwned(userId, transactionId);
      const transaction = await this.prisma.transaction.update({
        where: { transactionId },
        data: dto,
      });
      return {
        message: 'Transaction updated successfully',
        data: this.serialize(transaction),
      };
    } catch (error) {
      this.handleError(error, 'update transaction');
    }
  }

  async deleteTransaction(userId: string, transactionId: string) {
    try {
      await this.findOwned(userId, transactionId);
      await this.prisma.transaction.delete({ where: { transactionId } });
      return { message: 'Transaction deleted successfully', data: null };
    } catch (error) {
      this.handleError(error, 'delete transaction');
    }
  }
}
