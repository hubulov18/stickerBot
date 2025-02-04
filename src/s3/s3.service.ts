import {Injectable, NotFoundException} from '@nestjs/common';
import {getRepository, Repository} from 'typeorm'
import {InjectRepository} from "@nestjs/typeorm";
import {File} from "../entitities/file.entity";
import {Response} from "express";
import {FileRepository} from "./file.repository";
import {User} from "../entitities/user.entity";

const AWS = require("aws-sdk")

@Injectable()
export class S3Service {
    private fileRepository: Repository<File>

    constructor() {}
    s3 = new AWS.S3 ({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
        apiVersion: 'latest',
        endpoint:'https://fs.insystem.su:443',
        s3ForcePathStyle: true, // needed with minio?
        signatureVersion: 'v4'
    });
    async uploadFile(data: Buffer, filename: string, meta?: object) {

        const uploadResult = await this.s3.upload({
            Bucket : process.env.BUCKET,
            Body : data,
            Key : filename
        })
            .promise()
        console.log(uploadResult)
        this.fileRepository = getRepository(File)
        const newFile = this.fileRepository.create({
            key: uploadResult.Key,
            url: uploadResult.Location,
            meta: meta
        })
        await this.fileRepository.save(newFile);
        return newFile;
    }

    async downloadFile(filename: string): Promise<void> {
        const data = await this.s3.getObject({
            Bucket: process.env.BUCKET,
            Key: filename
        }).promise()
        console.log(data, typeof data)
    }

    async deleteFile (file: any) {
        //const file = await this.fileRepository.findOne(key);
        await this.s3.deleteObject({
            Bucket: process.env.BUCKET,
            Key: file.key
        }).promise()
        return await getRepository(File).delete({key:file.key})

    }
}
