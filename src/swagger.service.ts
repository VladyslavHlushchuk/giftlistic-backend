import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const enableSwagger = (
  app: INestApplication,
  documentationPath = 'api',
): void => {
  // Swagger буде активовано лише в non-production середовищі
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    console.log('Swagger документація вимкнена в production режимі.');
    return;
  }

  const port = process.env.APP_PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle("Gift's List")
    .setDescription('API документація для проєкту GiftListic')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth', // ім'я схеми авторизації
    )
    .addServer(`http://localhost:${port}/`, 'Local')
    // За потреби додай інші сервери, наприклад:
    // .addServer('https://api.yourdomain.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup(documentationPath, app, document, swaggerOptions);
};
