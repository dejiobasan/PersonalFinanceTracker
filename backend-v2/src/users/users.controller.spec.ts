import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('src/prisma/prisma.service', () => ({ PrismaService: class {} }));
jest.mock('src/cloudinary/cloudinary.service', () => ({
  CloudinaryService: class {},
}));

describe('UsersController', () => {
  let controller: UsersController;
  const service = {
    updateProfile: jest.fn().mockResolvedValue({ message: 'ok' }),
    deleteUser: jest.fn().mockResolvedValue({ message: 'ok' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    }).compile();
    controller = module.get(UsersController);
  });

  it('passes the logged in user id when updating profile', async () => {
    const req = { user: { userId: 'u1' } } as never;
    await controller.updateProfile(req, { name: 'N' });
    expect(service.updateProfile).toHaveBeenCalledWith('u1', { name: 'N' });
  });

  it('passes admin id and target id when deleting', async () => {
    const req = { user: { userId: 'admin' } } as never;
    await controller.deleteUser(req, 'u2');
    expect(service.deleteUser).toHaveBeenCalledWith('admin', 'u2');
  });
});
