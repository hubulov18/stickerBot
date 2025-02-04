import {BaseJob} from "./base.job";
import {EditService} from "../edit/edit.service";
import axios from "axios";
const cron = require('node-cron')


export class LongPoolJob extends BaseJob {
    private editService: EditService
    constructor() {
        super();
        this.editService = new EditService()
    }
    public launch(): void {
       // const response = axios.get()
    }
}

