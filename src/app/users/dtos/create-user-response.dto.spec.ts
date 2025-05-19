import { CreateUserResponseDTO } from './create-user-response.dto';
import { User } from '@prisma/client';

describe('CreateUserResponseDTO', () => {
  const mockUser = {
    id: 'user-id-123',
    email: 'tony@stark.com',
    name: 'Tony Stark',
    password: 'hashed-password',
    createdAt: new Date(),
    deletedAt: null,
  } as User;

  const token = 'jwt-token-example';

  it('should create DTO with correct fields and strip sensitive data', () => {
    const dto = CreateUserResponseDTO.factory(mockUser, token);

    expect(dto).toEqual({
      id: 'user-id-123',
      email: 'tony@stark.com',
      name: 'Tony Stark',
      access_token: token,
    });
  });

  it('should not include password, createdAt, or deletedAt', () => {
    const dto = CreateUserResponseDTO.factory(mockUser, token);

    expect((dto as any).password).toBeUndefined();
    expect((dto as any).createdAt).toBeUndefined();
    expect((dto as any).deletedAt).toBeUndefined();
  });
});
