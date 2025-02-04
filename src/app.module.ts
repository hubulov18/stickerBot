import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EditModule } from './edit/edit.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import {typeormConfig} from "./config/typeorm.config";
import { S3Module } from './s3/s3.module';
import * as Joi from 'joi';

@Module({
  imports: [EditModule,
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeormConfig),
    S3Module
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
