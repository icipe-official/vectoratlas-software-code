import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    HttpException,
    UseGuards,
    Body,
    Res,
    Header,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/user_role/roles.guard';
  import { Roles } from '../auth/user_role/roles.decorator';
  import { Role } from '../auth/user_role/role.enum';
  import { DatasetsService } from './datasets.service';
  
  @Controller('datasets')
  export class DatasetsController {
    constructor(private datasetService: DatasetsService) {}
  
    @UseGuards(AuthGuard('va'), RolesGuard)
    @Roles(Role.Uploader)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDataset(@UploadedFile() datasetFile: Express.Multer.File) {
      const filename = `${Date.now()}_${datasetFile.originalname}`;
      const blobPath = `datasets/${filename}`;
  
      const response = await this.datasetService.uploadDatasetFile(datasetFile);
      if (response.errorCode) {
        throw new HttpException(
          `Error uploading dataset file: ${response.errorCode}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { blobPath };
    }
  
    @Post('download')
    @Header('content-type', 'application/octet-stream')
    @HttpCode(HttpStatus.OK)
    async downloadDataset(
      @Res() res,
      @Body('fileName') fileName: string,
    ) {
      const data = await this.datasetService.downloadDatasetFile(fileName);
      return data.pipe(res);
    }
  }
  