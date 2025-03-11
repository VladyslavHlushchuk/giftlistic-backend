import type { LoginUserParams } from './login-user-params.interface';

export interface CreateUserParams extends LoginUserParams {
  name: string;
}
