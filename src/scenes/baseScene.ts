import axios from "axios";
import {getRepository, Repository} from "typeorm";
import {User} from "../entitities/user.entity";
import {Pack} from "../entitities/pack.entity";
import {File} from "../entitities/file.entity"
export class BaseScene {
    protected packRepository: Repository<Pack>
    protected userRepository: Repository<User>
    protected fileRepository: Repository<File>
    protected body: IBody

    constructor() {
        this.userRepository = getRepository(User)
        this.packRepository = getRepository(Pack)
        this.fileRepository = getRepository(File)
    }

    static async sendMessage(body: IBody): Promise<any> {

        return await axios.post(`https://${process.env.BOT_DOMAIN}/v2${process.env.BOT_TOKEN}/send`, body)
    }




    async nextStage(userId: number, scene: string, stage: string): Promise<void> {
        await this.userRepository.update({userId}, {scene: `${scene}`, stage: `${stage}`})
    }

    async cancelScene(userId: number): Promise<void> {
        await this.userRepository.update({userId}, {scene: null, stage: null})
    }


}