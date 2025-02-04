import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import {FastifyAdapter} from "@nestjs/platform-fastify";
import fastifyMultipart from "fastify-multipart";
import {FileRepository} from "./file.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {File} from "../entitities/file.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([File]),
  ],
  providers: [S3Service, FileRepository],
  controllers: [S3Controller]
})
export class S3Module {}
