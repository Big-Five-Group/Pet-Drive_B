import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  process.env.TZ = '-03:00';
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('PetDrive')
    .setDescription('Projeto PetDrive')
    .setContact(
      'Generation Brasil',
      'http://www.generationbrasil.online',
      'generation@email.com',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
