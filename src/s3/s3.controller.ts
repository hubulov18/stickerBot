import {
    Controller,
    Param,
    Post,
    Req,
    UploadedFile,
    UseInterceptors,
    Get,
    Res,
    Delete,
    ParseIntPipe, Query
} from '@nestjs/common';
import {S3Service} from "./s3.service";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('s3')
export class S3Controller {
constructor(private s3Service: S3Service) {
}
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile (@UploadedFile() file: Express.Multer.File): Promise<any> {
     //   console.log(file)
      return  await this.s3Service.uploadFile(file.buffer,file.originalname)
    }

    @Get('/download')
    async downloadFile(@Query('filename')file: string) {
        return  await this.s3Service.downloadFile(file)
    }

    @Delete('/delete')
    async deleteFile(@Query('fileId')fileId: string
    ) {
        console.log(fileId)
    return await this.s3Service.deleteFile(fileId)
    }

}
