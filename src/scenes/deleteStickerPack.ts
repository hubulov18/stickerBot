import {BaseScene} from "./baseScene";
import {getRepository, Repository} from "typeorm";
import {User} from "../entitities/user.entity";
import {Pack} from "../entitities/pack.entity";
import {S3Service} from "../s3/s3.service";

export default class DeleteStickerPack extends BaseScene {

    private s3Service: S3Service
    constructor() {
        super();
        this.s3Service = new S3Service()

    }

    async step_1(msg) {
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
            await this.nextStage(msg.user.id, 'deleteStickerPack', 'step_2')
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

    async step_2(msg) {
        const meta = {
            'pack':`${msg.message.msg}`
        }
        const files = await this.fileRepository.find({meta})
        files.map(
            async (item) => {
                await this.s3Service.deleteFile(item)
            }
        )
        await this.packRepository.delete({userId: msg.user.id, name: msg.message.msg}).then(
            async () => {
                    this.body = {
                        msg: "Стикерпак удалён!",
                        chat: msg.chat.id
                    }
                    await BaseScene.sendMessage(this.body)
                    await this.cancelScene(msg.user.id)
            }
        )
    }
}