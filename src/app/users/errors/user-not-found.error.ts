import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(message = 'Користувача не знайдено') {
    super(message);
    this.name = UserNotFoundException.name;
  }
}
