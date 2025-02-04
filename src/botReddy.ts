import axios from "axios";
import {EditService} from "./edit/edit.service";
import {InjectRepository} from "@nestjs/typeorm";
import {getUser} from "./repositories/user.repository";
import {Injectable} from "@nestjs/common";
import {getCustomRepositoryEntity} from "@nestjs/typeorm/dist/helpers";
import {User} from "./entitities/user.entity";
import {Repository, getRepository} from "typeorm";
import Convert from "./scenes/convert";
import { sceneProducer } from "./scenesFactory/abstactFactory";
import {BaseScene} from "./scenes/baseScene";

export default class BotReddy extends EditService {
    private  userRepository: Repository<User>
    private body: IBody;
    constructor() {
        super();
        this.userRepository = getRepository(User)
    }

    private messageQueue = []

    launch() {
        const subscribe = async () => {
        await axios.get(`https://${process.env.BOT_DOMAIN}/v2${process.env.BOT_TOKEN}/getupdate?chat=${process.env.CHAT}`)
                .then(async (res) => {
                    if (!res.data)
                        await subscribe()
                    else {
                        res.data.map((item) => {
                            this.messageQueue.push(item)
                        })
                        await subscribe()
                    }
                })
                .catch((reason) => {
                    subscribe()
                })
        }
        subscribe()
    }

    messagePooling() {
        const run = async () => {
            if (this.messageQueue.length) {
                await this.messageHandler(this.messageQueue.pop())
                this.messageQueue.pop()
                await run()
            } else {
                await new Promise(resolve => setTimeout(resolve, Number(process.env.POOLING_TIMEOUT)))
                await run()
            }
        }
        run()
    }

    private  async messageHandler(message) {

        let user: User = await getUser(message.user.id)

        if (!user) {

            const newUser = new User()
            newUser.userId = message.user.id
            await this.userRepository.save(newUser)
            await this.initCommands(message)
        }
        else {
            console.log(message.message.msg.toString())
                if ( (message.message.msg === '/quit') && (user.scene) ) {
                    await this.userRepository.update({userId: message.user.id}, {scene: null, stage: null}).then()
                    this.body = {
                        msg: "Вы вышли в главное меню",
                        chat: message.chat.id
                    }
                    await BaseScene.sendMessage(this.body)
                    user = await getUser(message.user.id)
                }
            if (user.scene) {
                const handler = sceneProducer(user.scene)

                await handler[user.stage](message)
            }
            else await this.initCommands(message)
        }

    }




    private async initCommands(message) {
        let instance = undefined
        switch (message.message.msg) {
            case '/convert' : {
                instance  =  sceneProducer('convert')
                await instance.step_1(message)
                break;
            }
            case '/cut': {
                //this.cut()
                break;
            }
            case '/newpack': {
                instance = sceneProducer('createStickerPack')
                await instance.step_1(message)
                break
            }
            case '/renamepack': {
                instance = sceneProducer('renameStickerPack')
                await instance.step_1(message)
                break
            }
            case '/menu': {
                await getRepository(User).update({userId:message.message.user.id}, {scene: null, stage:null})
                break
                }
            case '/deletepack': {
                instance = sceneProducer('deleteStickerPack')
                await instance.step_1(message)
                break
            }
            case '/compression': {
                instance = sceneProducer('compression')
                await instance.step_1(message)
                break
            }
            default: {
                const body: IBody = {
                    msg: `[b]Список доступных комманд:[/b]\n[b]\/help[/b] - список доступных команд\n[b]\/convert[/b] - конвертировать`,
                    chat: message.chat.id,
                    keyboard: [
                        [
                            {"type" : "command", "data" : "/help", "title": "help"}
                        ],
                        [
                            {"type" : "command", "data" : "/newpack", "title": "Создать новый стикерпак"},
                            {"type" : "command", "data" : "/renamepack", "title": "Переименовать стикерпак"}
                        ],
                        [
                            {"type" : "command", "data" : "/deletepack", "title": "Удалить стикерпак"},
                        ]
                    ]
                }
                await BaseScene.sendMessage(body)
                break;
            }
            }
        }
    }
