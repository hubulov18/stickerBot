import {File} from "../entitities/file.entity";
import {Repository, EntityRepository, getRepository} from "typeorm";
import axios from "axios";

@EntityRepository(File)
export class FileRepository extends Repository<File> {
    async getFile (url: string): Promise<any> {
        return axios({
            method: 'get',
            url: `${url}`,
            responseType: 'stream'
        });
    }


    async createRecord (body: IFile): Promise<any> {
        const file = new File()
        file.url = body.url
        file.key = body.key
        if (body.meta) file.meta = body.meta
        return await getRepository(File).save(file)
    }



}