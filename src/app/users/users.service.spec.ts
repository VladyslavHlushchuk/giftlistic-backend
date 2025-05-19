import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: 'user-id',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed-password',
  };

  const mockUsersRepository = {
    findFirst: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail()', () => {
    it('should return user by email', async () => {
      mockUsersRepository.findFirst.mockResolvedValueOnce(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findFirst).toHaveBeenCalledWith({
        email: 'john@example.com',
      });
    });
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      const data = { name: 'John', email: 'john@example.com', password: '123' };
      mockUsersRepository.create.mockResolvedValueOnce(mockUser);

      const result = await service.create(data as any);

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.create).toHaveBeenCalledWith(data);
    });
  });

  describe('getById()', () => {
    it('should return user by ID', async () => {
      mockUsersRepository.getById.mockResolvedValueOnce(mockUser);

      const result = await service.getById('user-id');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.getById.mockResolvedValueOnce(null);

      await expect(service.getById('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update()', () => {
    it('should update user and return updated user', async () => {
      const updateData = { name: 'Updated' };
      const updatedUser = { ...mockUser, name: 'Updated' };

      mockUsersRepository.update.mockResolvedValueOnce(updatedUser);

      const result = await service.update('user-id', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockUsersRepository.update).toHaveBeenCalledWith(
        'user-id',
        updateData,
      );
    });
  });
});
