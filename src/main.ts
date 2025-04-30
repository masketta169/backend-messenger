import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth API') // Название API
    .setDescription('Документация для авторизации') // Описание
    .setVersion('1.0') // Версия API
    .addTag('auth') // Тег для объединения эндпоинтов
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // если нужны cookie/авторизация
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
