import {BaseScene} from "./baseScene";
import {Repository} from "typeorm";
import {Pack} from "../entitities/pack.entity";
import {getRepository} from "typeorm";
import {User} from "../entitities/user.entity";
import {S3Service} from "../s3/s3.service";
import {getUser} from "../repositories/user.repository";
import * as fs from "fs";
import axios from "axios";
import {FileRepository} from "../s3/file.repository";
import {getFile} from "../repositories/file.repository";
import Bot from "../bot";
import BotReddy from "../botReddy";
const mime = require("mime");

export default class CreateStickerPack extends BaseScene {
    private s3Service: S3Service

    constructor() {
        super();
        this.s3Service = new S3Service()
    }

    async step_1 (msg) {
        this.body = {
            msg: "Введите название пака",
            chat: msg.chat.id
        }
        await BaseScene.sendMessage(this.body)
            .then(() => this.nextStage(msg.user.id,"createStickerPack", "step_2"))
            .catch((error) => {throw new Error(error) })
    }

    async step_2 (msg) {

        const user: User = await getUser(msg.user.id)
        if (msg.message.msg.length !== 0) {
            const pack = await this.packRepository.create({
                name: msg.message.msg,
                userId: user.userId,
                in_process: true
            })
            await this.packRepository.save(pack).then(
                () => {
                    this.body = {
                        msg: "Отлично! Теперь отправьте стикер\nPNG или WEBP формат",
                        chat: msg.chat.id
                    }
                    BaseScene.sendMessage(this.body).then(
                        () => this.nextStage(msg.user.id, 'createStickerPack', 'step_3')
                    )
                }
            )
                .catch(() => {
                    this.body = {
                        msg: "Такой пак существует!",
                        chat: msg.chat.id
                    }
                    BaseScene.sendMessage(this.body)
                })
        }
        else {
            this.body = {
                msg: "Отправьте пожалуйста название пака",
                chat: msg.chat.id
            }
            BaseScene.sendMessage(this.body)
        }
    }

    async step_3 (msg) {
        let file = undefined
        switch (msg.message.msg) {
            case '/publish' : {
                await this.packRepository.update({userId: msg.user.id, in_process:true}, {in_process: false})
                this.body = {
                    msg: "Отлично! Стикерпак создан.",
                    chat: msg.chat.id
                }
                await BaseScene.sendMessage(this.body)
                await this.cancelScene(msg.user.id)
                break;
            }
            default : {
                if ((msg.message.file === null) || ((msg.message.file.name.indexOf('.png', 1) === -1) && (msg.message.file.name.indexOf('.webp', 1) === -1))) {
                    this.body = {
                        msg: "Пожалуйста отправьте картинку PNG or WEBP формата",
                        chat: msg.chat.id
                    }
                    await BaseScene.sendMessage(this.body)
                } else {
                    let path:string = undefined
                    msg.message.file.name.indexOf('.png', 1) !== -1 ?
                        path = `${process.cwd()}/uploads/file.png` :
                        path = `${process.cwd()}/uploads/file.webp`
                    const file = fs.createWriteStream(`${path}`)
                    getFile(msg.message.file.url)
                        .then(async (response) => {
                            response.data.pipe(file);

                            this.body = {
                                msg: 'Отправьте следующий стикер или /publish если это был последний стикер',
                                chat: msg.chat.id
                            }
                            await BaseScene.sendMessage(this.body)
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .then(
                            () => {
                                file.end();
                                fs.readFile(`${path}`,async  (err, data) => {
                                    if (err) console.log(err)
                                    else
                                    {
                                        const pack = await this.packRepository.find({in_process: true, userId:msg.user.id})
                                        await this.s3Service.uploadFile(data,`${msg.user.id}_${Date.now()}`,{pack:pack[0].name})
                                    }
                                })
                            }
                        )


                }
            }
        }

    }

    async step_4 (msg) {

    }
        //   await this.s3Service.uploadFile()
}
