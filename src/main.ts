import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Bot from "./bot";
import {FastifyAdapter} from "@nestjs/platform-fastify";
import fastifyMultipart from 'fastify-multipart';

async function bootstrap() {
  const fastlyAdapter = new FastifyAdapter();
  fastlyAdapter.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 1024, // Max field name size in bytes
      fieldSize: 128 * 1024 * 1024 * 1024, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 128 * 1024 * 1024 * 1024, // For multipart forms, the max file size
      files: 2, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
    },
  })
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  await Promise.all([new Bot().start()])

}
bootstrap();
