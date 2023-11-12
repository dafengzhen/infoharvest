// noinspection JSIgnoredPromiseFromCall

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { XPoweredByInterceptor } from './interceptor/xpoweredby.interceptor';
import { NoEmptyInterceptor } from './interceptor/noempty.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

/**
 * bootstrap.
 *
 * @author dafengzhen
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useGlobalInterceptors(
    new NoEmptyInterceptor(),
    process.env.POWERED_BY_HEADER === 'true'
      ? new XPoweredByInterceptor('infoharvest')
      : null,
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
    }),
  );
  app.useBodyParser('json', { limit: '16mb' });
  app.useBodyParser('urlencoded', { limit: '16mb' });
  await app.listen(8080);
}

bootstrap();
