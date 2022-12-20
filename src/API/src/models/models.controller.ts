import {
  Controller,
  Post,
  UseInterceptors,
  HttpException,
  UseGuards,
  UploadedFile,
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
    const response = await this.modelsService.uploadModelFileToBlob(modelFile);
    if (response.errorCode) {
      throw new HttpException(
        `Error uploading model file: ${response.errorCode}`,
        500,
      );
    }
    return true;
  }
}
