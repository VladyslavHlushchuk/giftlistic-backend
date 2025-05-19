// recaptcha.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class RecaptchaService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async verify(token: string): Promise<boolean> {
    if (
      process.env.NODE_ENV === 'development' ||
      token === 'dummyTokenForDev'
    ) {
      return true;
    }

    const secret = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
    const response: AxiosResponse<any> = await firstValueFrom(
      this.httpService.post(url),
    );
    const data = response.data;
    if (!data.success) {
      throw new BadRequestException('Не пройдено перевірку reCAPTCHA');
    }
    return data.success;
  }
}
