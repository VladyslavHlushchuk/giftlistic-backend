export class EmailAlreadyRegisteredException extends Error {
  constructor(message = 'Ця електронна адреса вже зареєстрована') {
    super(message);
    this.name = EmailAlreadyRegisteredException.name;
  }
}
