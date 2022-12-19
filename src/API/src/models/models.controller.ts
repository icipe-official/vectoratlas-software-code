import {
  Controller,
  Post,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { ModelsService } from './models.service';

const multerOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (extname(file.originalname).match('^.*.(tif|shp)$')) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(
            file.originalname,
          )}. Expected .tif or .shp.`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};

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
