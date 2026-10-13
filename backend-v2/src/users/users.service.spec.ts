import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersService } from './users.service';

jest.mock('src/prisma/prisma.service', () => ({ PrismaService: class {} }));
jest.mock('src/cloudinary/cloudinary.service', () => ({
  CloudinaryService: class {},
}));

describe('UsersService', () => {
  let service: UsersService;
  const prisma = {
    $transaction: jest.fn(),
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transaction: { deleteMany: jest.fn() },
    otp: { deleteMany: jest.fn() },
  };
  const cloudinary = { uploadImage: jest.fn(), deleteImage: jest.fn() };
  const user = {
    userId: 'u1',
    email: 'a@b.com',
    name: 'A',
    phoneNumber: '1234567890',
    isVerified: true,
    role: 'USER',
    userImage:
      'https://res.cloudinary.com/x/image/upload/v1/personal-finance-tracker-v2/abc.png',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((ops: unknown[]) =>
      Promise.all(ops),
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: CloudinaryService, useValue: cloudinary },
      ],
    }).compile();
    service = module.get(UsersService);
  });

  it('lists users with transaction counts, search and pagination', async () => {
    prisma.user.findMany.mockResolvedValue([
      { userId: 'u1', name: 'Jo', _count: { transactions: 4 } },
    ]);
    prisma.user.count.mockResolvedValue(11);
    const res = await service.getAllUsers({ name: 'jo', page: 2, limit: 5 });
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: { contains: 'jo', mode: 'insensitive' } },
        skip: 5,
        take: 5,
      }),
    );
    expect(res.data.items).toEqual([
      { userId: 'u1', name: 'Jo', totalTransactions: 4 },
    ]);
    expect(res.data.meta).toEqual({ total: 11, page: 2, limit: 5, totalPages: 3 });
  });

  it('refuses to delete own account', async () => {
    await expect(service.deleteUser('u1', 'u1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('404s when deleting a missing user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.deleteUser('admin', 'u1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deletes transactions, otps, user and image', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    prisma.transaction.deleteMany.mockResolvedValue({ count: 3 });
    prisma.otp.deleteMany.mockResolvedValue({ count: 1 });
    prisma.user.delete.mockResolvedValue(user);
    const res = await service.deleteUser('admin', 'u1');
    expect(res.data).toEqual({ deletedTransactions: 3, deletedOtps: 1 });
    expect(cloudinary.deleteImage).toHaveBeenCalledWith(
      'personal-finance-tracker-v2/abc',
    );
  });

  it('rejects an empty profile update', async () => {
    await expect(service.updateProfile('u1', {})).rejects.toThrow(
      BadRequestException,
    );
  });

  it('updates only provided fields', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    prisma.user.update.mockResolvedValue({ ...user, name: 'New' });
    const res = await service.updateProfile('u1', { name: 'New' });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      data: { name: 'New' },
    });
    expect(cloudinary.uploadImage).not.toHaveBeenCalled();
    expect(res.data.name).toBe('New');
  });

  it('uploads new image and removes the old one', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    cloudinary.uploadImage.mockResolvedValue('https://new/image.png');
    prisma.user.update.mockResolvedValue({
      ...user,
      userImage: 'https://new/image.png',
    });
    await service.updateProfile('u1', { userImage: 'data:image/png;base64,x' });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      data: { userImage: 'https://new/image.png' },
    });
    expect(cloudinary.deleteImage).toHaveBeenCalledWith(
      'personal-finance-tracker-v2/abc',
    );
  });
});
