import {BaseScene} from "./baseScene";
import {getRepository, Repository} from "typeorm";
import {Pack} from "../entitities/pack.entity";
import {User} from "../entitities/user.entity";
import {getUser} from "../repositories/user.repository";

export default class RenameStickerPack extends BaseScene {

    constructor() {
        super();
    }
    async step_1 (msg) {
        const pack = await this.packRepository.find({userId: msg.user.id})


        if (pack.length) {
            this.body = {
                msg: `Выберите пак`,
                chat: msg.chat.id,
                keyboard: [[]]
            }
            pack.map(async item => {
                this.body.keyboard[0].push({
                    type: "command",
                    data: `${item.name}`,
                    title: `${item.name}`
                })
            })
            await BaseScene.sendMessage(this.body)
            await this.nextStage(msg.user.id, 'renameStickerPack', 'step_2')
        }
        else {
            this.body = {
                msg: 'У Вас нет стикерпаков',
                chat: msg.chat.id
            }
            await BaseScene.sendMessage(this.body)
            await this.cancelScene(msg.user.id)
        }
    }

    async step_2 (msg) {

        await this.packRepository.update({name: msg.message.msg, userId:msg.user.id}, {in_process: true}).then(
            async () => {
                this.body = {
                    msg: "Введите новое название",
                    chat: msg.chat.id
                }
                await BaseScene.sendMessage(this.body)
                await this.nextStage(msg.user.id, 'renameStickerPack','step_3')
            }
        )
    }

    async step_3(msg) {
        await this.packRepository.update({userId: msg.user.id, in_process: true}, {name: msg.message.msg, in_process: false}).then(
            async () => {
                this.body = {
                    msg: 'Стикерпак переименован',
                    chat: msg.chat.id
                }
                await this.cancelScene(msg.user.id)
                await BaseScene.sendMessage(this.body)
            }
        )
    }

}