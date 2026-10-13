import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

jest.mock('src/prisma/prisma.service', () => ({ PrismaService: class {} }));

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  const service = {
    getAdminAnalytics: jest.fn().mockResolvedValue({ message: 'ok' }),
    getUserAnalytics: jest.fn().mockResolvedValue({ message: 'ok' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: service }],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes the logged in user id to the service', async () => {
    await controller.getUserAnalytics({ user: { userId: 'u1' } } as never);
    expect(service.getUserAnalytics).toHaveBeenCalledWith('u1');
  });

  it('delegates admin analytics', async () => {
    await controller.getAdminAnalytics();
    expect(service.getAdminAnalytics).toHaveBeenCalled();
  });
});
