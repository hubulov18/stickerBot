import {BadRequestException, Injectable} from '@nestjs/common';
import {MemoryStoredFile} from "nestjs-form-data";
import * as Sharp from 'sharp'
import {ExceptionHandler} from "@nestjs/core/errors/exception-handler";
import * as imageConversion from 'image-conversion';
const sharp = require('sharp')
import {log} from "util";
import axios from "axios";
import * as fs from "fs";
const FormData = require('form-data');

@Injectable()
export class EditService {
    public async convert(file: Express.Multer.File, to: string) : Promise<string>{
        console.log(file)
        console.log(to)
        switch (file.mimetype) {
            case 'image/png': {
                return "Hello"
                }
            default: throw new BadRequestException('This extension is not supported')
        }
    }

    public async cut(file: Express.Multer.File, width: number, height: number): Promise<any> {
        console.log(file)
        const result = new Promise((resolve,reject) => {
            sharp(file.buffer)
                .resize({width, height})
                .toFile('output.png')
            resolve('done');
        })
            result.then(async data => {
                const body = new FormData()
                body.append('file',fs.createReadStream(__dirname+'/output.png'))
                console.log(body)
                await axios.post(`https://${process.env.BOT_DOMAIN}/bot${process.env.BOT_TOKEN}/sendfile?chat=404682&msg=hello&type=image`,body)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(reason => {
                        console.log(reason)
                    })
            })
    }
}
