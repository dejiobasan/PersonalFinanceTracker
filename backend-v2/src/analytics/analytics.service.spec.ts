import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsService } from './analytics.service';

jest.mock('src/prisma/prisma.service', () => ({ PrismaService: class {} }));

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  const prisma = {
    $transaction: jest.fn(),
    user: { count: jest.fn() },
    transaction: { groupBy: jest.fn(), aggregate: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((ops: unknown[]) =>
      Promise.all(ops),
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('admin analytics maps counts and average', async () => {
    prisma.user.count.mockResolvedValue(5);
    prisma.transaction.groupBy.mockResolvedValue([
      { type: 'CREDIT', _count: { _all: 3 } },
      { type: 'DEBIT', _count: { _all: 7 } },
    ]);
    prisma.transaction.aggregate.mockResolvedValue({
      _avg: { amount: '100.456' },
    });
    const res = await service.getAdminAnalytics();
    expect(res.data).toEqual({
      totalUsers: 5,
      totalDebitTransactions: 7,
      totalCreditTransactions: 3,
      averageTransactionAmount: 100.46,
    });
  });

  it('user analytics is scoped and handles no transactions', async () => {
    prisma.transaction.groupBy.mockResolvedValue([]);
    prisma.transaction.aggregate.mockResolvedValue({ _avg: { amount: null } });
    const res = await service.getUserAnalytics('u1');
    expect(res.data).toEqual({
      totalUserTransactions: 0,
      totalUserCreditTransactions: 0,
      totalUserDebitTransactions: 0,
      averageUserTransactionAmount: 0,
    });
    expect(prisma.transaction.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'u1' } }),
    );
  });

  it('user analytics sums credit and debit', async () => {
    prisma.transaction.groupBy.mockResolvedValue([
      { type: 'CREDIT', _count: { _all: 2 } },
      { type: 'DEBIT', _count: { _all: 4 } },
    ]);
    prisma.transaction.aggregate.mockResolvedValue({ _avg: { amount: 50 } });
    const res = await service.getUserAnalytics('u1');
    expect(res.data.totalUserTransactions).toBe(6);
    expect(res.data.averageUserTransactionAmount).toBe(50);
  });
});
