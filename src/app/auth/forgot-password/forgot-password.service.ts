import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ForgotPasswordService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // використовуйте true, якщо порт 465
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    // Перевіряємо, чи існує користувач з цим email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Користувача з таким email не знайдено');
    }

    // Генеруємо токен для скидання паролю
    const resetToken = jwt.sign(
      { sub: user.id },
      this.configService.get<string>('JWT_RESET_SECRET'),
      { expiresIn: this.configService.get<string>('JWT_RESET_EXPIRES_IN') },
    );

    // Формуємо посилання для скидання паролю
    const resetUrl = `${this.configService.get<string>('RESET_PASSWORD_URL')}${resetToken}`;

    // Формуємо повідомлення
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to: email,
      subject: 'Reset Your Password',
      text: `Будь ласка, перейдіть за посиланням для скидання паролю: ${resetUrl}`,
      html: `<p>Будь ласка, <a href="${resetUrl}">натисніть тут</a> для скидання паролю.</p>`,
    };

    // Відправляємо лист
    await this.transporter.sendMail(mailOptions);
  }
}
