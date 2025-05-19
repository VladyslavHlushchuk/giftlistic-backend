import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as passport from 'passport';
import { Strategy } from 'passport-strategy';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeAll(() => {
    class FakeJwtStrategy extends Strategy {
      name = 'jwt';

      authenticate(this: any) {
        this.success({ id: 'test-user' });
      }
    }

    passport.use(new FakeJwtStrategy());
  });

  beforeEach(() => {
    guard = new JwtAuthGuard(new Reflector());
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call canActivate and return true', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
        getResponse: () => ({
          end: () => {},
          setHeader: () => {},
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });
});
