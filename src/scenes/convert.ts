import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entitities/user.entity";
import {getRepository, Repository} from "typeorm";
import axios from "axios";
import * as fs from "fs";
import {EditService} from "../edit/edit.service";
import {response} from "express";
import * as http from "http";
import {BaseScene} from "./baseScene";
import {ExceptionHandler} from "@nestjs/core/errors/exception-handler";
import {S3Service} from "../s3/s3.service";
import {getFile} from "../repositories/file.repository";

export  default  class  Convert extends BaseScene {

    private editService:EditService;
    private s3:S3Service;
    constructor() {
         super()

    }
    async step_1 (msg) {

            const body: IBody = {
                msg: "Отправьте файл",
                chat: msg.chat.id
            }

           await BaseScene.sendMessage(body).then(
               () => {
                   this.nextStage(msg.user.id,"convert","step_2")
               }
           )
               .catch(
                   (error) => {throw new Error(error) }
               )

    }

    async step_2 (msg) {
        if (msg.message.file !== null) {
            const file = await fs.createWriteStream('file')
                getFile(msg.message.file.url)
                .then(function (response) {
                    response.data.pipe(file);
           //         fs.readSync(1,s)
                })
                .catch(function (error) {
                });
        }
        else {
            const body :IBody = {
                msg: "Это не файл",
                chat: msg.chat.id
            }
            await BaseScene.sendMessage(body)
        }
    }


    async step_3() {

    }

}