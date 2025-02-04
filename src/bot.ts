import {BaseJob} from "./jobs/base.job";
import {LongPoolJob} from "./jobs/longPool.job";
import BotReddy from "./botReddy";

export default class Bot {
    private bot: BotReddy
    private crons: BaseJob[]
    constructor() {
        this.bot = new BotReddy()
     //   this.initJobs()
     //   this.startJobs()
     //   this.startLongPool()
        this.bot.messagePooling()
    }


    private initJobs() {
        this.crons = [
        new LongPoolJob()
        ]
    }

    private startJobs() {
        for (let job of this.crons) {
            job.launch()
        }
    }

    public async start() {
        await this.startLongPool();
    }

    private async startLongPool(): Promise<void> {
        await this.bot.launch()
        console.log("Bot started!")
    }
}