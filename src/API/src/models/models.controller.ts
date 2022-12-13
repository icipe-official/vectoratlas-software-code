import { Controller, Post, UploadedFile, UseInterceptors, ParseFilePipe, FileTypeValidator, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import path, { extname } from 'path';

const multerOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (extname(file.originalname).match('^.*\.(tif|shp)$')) {
        // Allow storage of file
        cb(null, true);
    } else {
        // Reject file
        cb(new HttpException(`Unsupported file type ${extname(file.originalname)}. Expected .tif or .shp.`, HttpStatus.BAD_REQUEST), false);
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = `/data/vector-atlas/models/${file.originalname.replace(/\.[^/.]+$/, "")}`;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      const filename = `${new Date().getTime()}_${file.originalname}`
      // Calling the callback passing the random name generated with the original extension name
      cb(null, filename);
  },
  })
}

@Controller('models')
export class ModelsController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadModel(@UploadedFile() modelFile: Express.Multer.File) {
  }
}
