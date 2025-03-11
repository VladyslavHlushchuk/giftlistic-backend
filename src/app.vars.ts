import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService();

export const APP_PORT = configService.getOrThrow<number>('APP_PORT');
export const APP_NAME = configService.getOrThrow<string>('APP_NAME');

export const POSTGRES_DB = configService.getOrThrow<string>('POSTGRES_DB');
export const POSTGRES_USER = configService.getOrThrow<string>('POSTGRES_USER');
export const POSTGRES_PASSWORD =
  configService.getOrThrow<string>('POSTGRES_PASSWORD');
export const POSTGRES_PORT = configService.getOrThrow<number>('POSTGRES_PORT');

export const POSTGRES_CONTAINER_NAME = configService.getOrThrow<string>(
  'POSTGRES_CONTAINER_NAME',
);
export const DATABASE_URL = configService.getOrThrow<string>('DATABASE_URL');
