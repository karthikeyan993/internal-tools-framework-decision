import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

const app = await NestFactory.create(AppModule);
configureApp(app);
await app.listen(Number.parseInt(process.env.PORT ?? '8080', 10), '0.0.0.0');
