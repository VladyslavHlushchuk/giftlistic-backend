import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser = {
    id: 'user-id',
    name: 'John',
    email: 'john@example.com',
  };

  const mockUsersService = {
    getById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserById()', () => {
    it('should return user if found', async () => {
      mockUsersService.getById.mockResolvedValueOnce(mockUser);

      const result = await controller.getUserById('user-id');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.getById).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.getById.mockResolvedValueOnce(null);

      await expect(controller.getUserById('not-found-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser()', () => {
    it('should update and return user', async () => {
      const updateData = { name: 'Updated' };
      const updatedUser = { ...mockUser, ...updateData };

      mockUsersService.update.mockResolvedValueOnce(updatedUser);

      const result = await controller.updateUser('user-id', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(
        'user-id',
        updateData,
      );
    });
  });
});
