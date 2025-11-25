import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOriginEnv =
    process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174';
  const corsOrigins = corsOriginEnv.split(/[,\s]+/).filter(Boolean);

  const originFunction = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (
      process.env.NODE_ENV !== 'production' &&
      origin.startsWith('http://localhost:')
    ) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  };

  app.enableCors({
    origin:
      process.env.NODE_ENV !== 'production'
        ? originFunction
        : corsOrigins.length > 1
          ? corsOrigins
          : corsOrigins[0],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Biblioteca API')
    .setDescription(
      'API RESTful para la gestión de préstamos de una biblioteca. Documentación completa de todos los endpoints disponibles.',
    )
    .setVersion('1.0')
    .addTag('usuarios', 'Operaciones relacionadas con usuarios')
    .addTag('libros', 'Operaciones relacionadas con libros')
    .addTag('prestamos', 'Operaciones relacionadas con préstamos')
    .addServer('http://localhost:3000', 'Servidor de desarrollo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Biblioteca API - Documentación',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`Documentación Swagger: http://localhost:${port}/api/docs`);
}

void bootstrap();
