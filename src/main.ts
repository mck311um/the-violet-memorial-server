import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import * as crypto from 'node:crypto';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.use(cookieParser());

  if (!(globalThis as any).crypto) {
    (globalThis as any).crypto = crypto;
  }

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedDomains = [
        'localhost:3000',
        'localhost:5173',
        'localhost:5174',
        'dev.thevioletmemorial.org',
        'www.dev.thevioletmemorial.org',
        'thevioletmemorial.org',
        'www.thevioletmemorial.org',
      ];

      const isAllowed = allowedDomains.some((domain) =>
        origin.endsWith(domain),
      );

      callback(null, isAllowed);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-timestamp',
      'x-api-key',
      'x-signature',
    ],
  });

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
