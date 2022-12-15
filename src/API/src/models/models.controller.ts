import { BlobServiceClient } from '@azure/storage-blob';
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
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';

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
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = `/data/vector-atlas/models/${file.originalname.replace(
        /\.[^/.]+$/,
        '',
      )}`;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      const filename = `${new Date().getTime()}_${file.originalname}`;
      // Calling the callback passing the new filename
      cb(null, filename);
    },
  }),
};

@Controller('models')
export class ModelsController {
/*   @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader) */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadModel(@UploadedFile() modelFile: Express.Multer.File) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerCLient = blobServiceClient.getContainerClient('vectoratlas-container')
    console.log(modelFile)
    const blobCLient = containerCLient.getBlockBlobClient(modelFile.originalname)
    await blobCLient.uploadData(modelFile.buffer);
  }
}
