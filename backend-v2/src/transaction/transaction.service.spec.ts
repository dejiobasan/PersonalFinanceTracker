import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionService } from './transaction.service';

jest.mock('src/prisma/prisma.service', () => ({ PrismaService: class {} }));

describe('TransactionService', () => {
  let service: TransactionService;
  const prisma = {
    $transaction: jest.fn(),
    transaction: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  const tx = { transactionId: 't1', userId: 'u1', amount: '10.50' };

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((ops: unknown[]) =>
      Promise.all(ops),
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('admin list applies name/type filters and pagination meta', async () => {
    prisma.transaction.findMany.mockResolvedValue([tx]);
    prisma.transaction.count.mockResolvedValue(25);
    const res = await service.getAllTransactions({
      name: 'jo',
      type: 'CREDIT',
      page: 2,
      limit: 10,
    });
    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          type: 'CREDIT',
          user: { name: { contains: 'jo', mode: 'insensitive' } },
        },
        skip: 10,
        take: 10,
      }),
    );
    expect(res.data.meta).toEqual({
      total: 25,
      page: 2,
      limit: 10,
      totalPages: 3,
    });
    expect(res.data.items[0].amount).toBe(10.5);
  });

  it('deleteAll returns deleted count', async () => {
    prisma.transaction.deleteMany.mockResolvedValue({ count: 4 });
    const res = await service.deleteAllTransactions();
    expect(res.data).toEqual({ deletedCount: 4 });
  });

  it('user list is scoped to the user', async () => {
    prisma.transaction.findMany.mockResolvedValue([]);
    prisma.transaction.count.mockResolvedValue(0);
    await service.getUserTransactions('u1', { page: 1, limit: 5 });
    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'u1' } }),
    );
  });

  it('getById throws NotFound when not owned', async () => {
    prisma.transaction.findFirst.mockResolvedValue(null);
    await expect(service.getUserTransactionById('u1', 't1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('create attaches userId', async () => {
    prisma.transaction.create.mockResolvedValue(tx);
    await service.createTransaction('u1', {
      amount: 10.5,
      description: 'x',
      type: 'CREDIT',
    });
    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: { amount: 10.5, description: 'x', type: 'CREDIT', userId: 'u1' },
    });
  });

  it('update and delete require ownership', async () => {
    prisma.transaction.findFirst.mockResolvedValue(null);
    await expect(
      service.updateTransaction('u1', 't1', { description: 'y' }),
    ).rejects.toThrow(NotFoundException);
    await expect(service.deleteTransaction('u1', 't1')).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.transaction.update).not.toHaveBeenCalled();
    expect(prisma.transaction.delete).not.toHaveBeenCalled();
  });

  it('update and delete succeed for owner', async () => {
    prisma.transaction.findFirst.mockResolvedValue(tx);
    prisma.transaction.update.mockResolvedValue(tx);
    prisma.transaction.delete.mockResolvedValue(tx);
    expect((await service.updateTransaction('u1', 't1', {})).data.amount).toBe(
      10.5,
    );
    expect((await service.deleteTransaction('u1', 't1')).data).toBeNull();
  });
});
