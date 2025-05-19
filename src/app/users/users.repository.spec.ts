import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let prisma: PrismaService;

  const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    refreshToken: null,
    deletedAt: null,
    createdAt: undefined,
  };

  const prismaMock = {
    user: {
      create: jest.fn().mockResolvedValue(mockUser),
      findFirst: jest.fn().mockResolvedValue(mockUser),
      findUnique: jest.fn().mockResolvedValue(mockUser),
      update: jest
        .fn()
        .mockResolvedValue({ ...mockUser, name: 'Updated Name' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await repository.create({
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedpassword',
    });

    expect(result).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
      },
    });
  });

  it('should find first user by condition', async () => {
    const result = await repository.findFirst({ email: 'test@example.com' });

    expect(result).toEqual(mockUser);
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should get user by ID', async () => {
    const result = await repository.getById('user-id');

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-id' },
    });
  });

  it('should update user', async () => {
    const result = await repository.update('user-id', { name: 'Updated Name' });

    expect(result).toEqual({ ...mockUser, name: 'Updated Name' });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      data: { name: 'Updated Name' },
    });
  });
});
