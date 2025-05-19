import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const enableSwagger = (
  app: INestApplication,
  documentationPath = 'api',
): void => {
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
      'access-token',
    )
    .addServer(`http://localhost:${port}/`, 'Local')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup(documentationPath, app, document, swaggerOptions);
};
