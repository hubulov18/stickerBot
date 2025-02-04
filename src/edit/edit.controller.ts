import {Body, Controller, ParseIntPipe, Post, Query, Res, UploadedFile, UseInterceptors} from "@nestjs/common";
import {EditService} from "./edit.service";
import {Response} from 'express'
import {FileInterceptor} from '@nestjs/platform-express'
import {MemoryStoredFile, FormDataRequest} from "nestjs-form-data";
import {createReadStream} from "fs";
import {builders} from "prettier/doc";
import {join} from 'path'
import {of} from "rxjs";
const FormData = require('form-data');

@Controller('edit')
export class EditController {
    constructor(private  editService: EditService) {}

    @Post('/convert')
    @UseInterceptors(FileInterceptor('file'))
    async convert(@UploadedFile() file: Express.Multer.File, @Body('to')to: string, @Res()response: Response) : Promise<string>{
        return this.editService.convert(file,to)
    }

    @Post('/cut')
    @UseInterceptors(FileInterceptor('file'))
    async cut(@UploadedFile() file: Express.Multer.File, @Query('width',ParseIntPipe)width: number, @Query('height',ParseIntPipe)height: number): Promise<any> {
        return this.editService.cut(file,width,height)
    }

    

}
