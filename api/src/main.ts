import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: (process.env.API_CORS_ORIGINS || '').split(',') });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);
  await app.listen(process.env.API_PORT || 3000, '0.0.0.0');
}

bootstrap();
