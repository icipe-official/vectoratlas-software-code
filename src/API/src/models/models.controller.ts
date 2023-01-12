import {
  Controller,
  Post,
  UseInterceptors,
  HttpException,
  UseGuards,
  UploadedFile,
  Body,
  Res,
  Header,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { ModelsService } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private modelsService: ModelsService) {}

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadModel(@UploadedFile() modelFile: Express.Multer.File) {
    const filepath = `models/${modelFile.originalname.replace(
      /\.[^/.]+$/,
      '',
    )}`;
    const filename = `${new Date().getTime()}_${modelFile.originalname}`;
    const blobPath = `${filepath}/${filename}`;
    const response = await this.modelsService.uploadModelFileToBlob(modelFile, blobPath);
    if (response.errorCode) {
      throw new HttpException(
        `Error uploading model file: ${response.errorCode}`,
        500,
      );
    }
    return blobPath;
  }

  @Post('download')
  @Header('content-type', 'application/octet-stream')
  @HttpCode(HttpStatus.OK)
  async downloadModel(@Res() res, @Body('blobLocation') blobLocation: string) {
    const data = await this.modelsService.downloadModelFile(blobLocation);
    return data.pipe(res);
  }
}
