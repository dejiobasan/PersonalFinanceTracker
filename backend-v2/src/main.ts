import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ThrottlerExceptionFilter } from './common/filters/throttler-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new ThrottlerExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL!,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Personal Finance Tracker API')
    .setDescription('The Personal Finance Tracker API documentation.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  });
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api/json',
    yamlDocumentUrl: 'api/yaml',
  });
  if (process.env.NODE_ENV !== 'production') {
    writeFileSync(
      join(process.cwd(), 'openapi.json'),
      JSON.stringify(document, null, 2),
    );
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
