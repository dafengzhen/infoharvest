import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { XPoweredByInterceptor } from './interceptor/xpoweredby.interceptor';
import { NoEmptyInterceptor } from './interceptor/noempty.interceptor';

/**
 * bootstrap.
 *
 * @author dafengzhen
 */
(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(
    new XPoweredByInterceptor('infoharvest'),
    new NoEmptyInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(8080);
})();
