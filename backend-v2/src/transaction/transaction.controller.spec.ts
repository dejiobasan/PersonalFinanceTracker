import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

jest.mock('src/prisma/prisma.service', () => ({ PrismaService: class {} }));

describe('TransactionController', () => {
  let controller: TransactionController;
  const service = {
    getUserTransactions: jest.fn().mockResolvedValue({ message: 'ok' }),
    deleteTransaction: jest.fn().mockResolvedValue({ message: 'ok' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{ provide: TransactionService, useValue: service }],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes the logged in user id to the service', async () => {
    const req = { user: { userId: 'u1' } } as never;
    await controller.getUserTransactions(req, { page: 1, limit: 10 });
    expect(service.getUserTransactions).toHaveBeenCalledWith('u1', {
      page: 1,
      limit: 10,
    });
    await controller.deleteTransaction(req, 't1');
    expect(service.deleteTransaction).toHaveBeenCalledWith('u1', 't1');
  });
});
