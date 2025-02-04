import {ScheduledTask} from 'node-cron'

export abstract class BaseJob {
    protected task: ScheduledTask;

    public abstract launch(): void;

    public start(): void {
        this.task.start()
    }

    public stop(): void {
        this.task.stop()
    }
}