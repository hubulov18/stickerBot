import {BaseScene} from "./baseScene";
import * as fs from "fs";
import {getFile} from "../repositories/file.repository";
import * as gm from 'gm'
const sharp = require('sharp');


export default class Compression extends BaseScene {

    async step_1(msg) {
        const body: IBody = {
            msg: "Отправьте файл",
            chat: msg.chat.id
        }

        await BaseScene.sendMessage(body).then(
            () => {
                this.nextStage(msg.user.id, "compression", "step_2")
            }
        )
            .catch(
                (error) => {
                    throw new Error(error)
                }
            )
    }

    async step_2(msg) {
        if ((msg.message.file === null) || ((msg.message.file.name.indexOf('.png', 1) === -1) && (msg.message.file.name.indexOf('.jpg', 1) === -1))) {
            this.body = {
                msg: "Пожалуйста отправьте картинку png or jpg",
                chat: msg.chat.id
            }
            await BaseScene.sendMessage(this.body)
        } else {
            let path: string = undefined
            msg.message.file.name.indexOf('.png', 1) !== -1 ?
                path = `${process.cwd()}/uploads/compression.png` :
                path = `${process.cwd()}/uploads/compression.webp`
            const file = fs.createWriteStream(`${path}`)
            getFile(msg.message.file.url)
                .then(async (response) => {
                    response.data.pipe(file);
                })
            this.body = {
                msg: "Введите ширину и высоту через пробел",
                chat: msg.chat.id
            }
            await BaseScene.sendMessage(this.body)
            await this.nextStage(msg.user.id,'compression', 'step_3')
        }
    }

    async step_3 (msg) {
        const file = fs.createWriteStream(`${process.cwd()}/uploads/images/compression.png`)
        let outStream = fs.createWriteStream('output.png', {flags: "w"});
        gm('/home/vadim/Desktop/workCCS/bot/uploads/images/compression.png')
            .resize(100,100)
            .write(file, (err) => {
                if (!err) console.log('yeah!')
                else console.log(err)
            })
        let transform = sharp()
            .resize({width: 100, height: 100})
            .on('info', (fileinfo) => {
                console.log('it is ok')
            })
        file.pipe(transform).pipe(outStream)
    }
}