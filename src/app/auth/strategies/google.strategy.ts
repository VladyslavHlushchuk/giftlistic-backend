// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4444/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, displayName, name } = profile;
    const email = emails[0].value;

    // Знаходимо користувача за email. Якщо не існує — створюємо нового.
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      // Тут можна створити користувача з дефолтним або випадковим паролем
      // Важливо: метод create в UsersService повинен враховувати соц. аккаунти (можна, наприклад, зберігати null або пустий рядок як пароль)
      user = await this.usersService.create({
        name: displayName || `${name.givenName} ${name.familyName}`,
        email: email,
        password: '', // або згенерувати випадковий рядок
      });
    }
    // Додатково можна зберегти фото чи інші дані з профілю
    return done(null, user);
  }
}
