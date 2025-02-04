import { Module } from '@nestjs/common';
import { EditController } from './edit.controller';
import { EditService } from './edit.service';
import {NestjsFormDataModule} from "nestjs-form-data";

@Module({
    imports: [
        NestjsFormDataModule,
    ],
    providers: [EditService],
    controllers: [EditController],
})
export class EditModule {}
