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
import { UploadedModelService } from 'src/db/uploaded-model/uploaded-model.service';
import { UploadedModel } from 'src/db/uploaded-model/entities/uploaded-model.entity';
import { Repository } from 'typeorm';
import { AuthUser } from 'src/auth/user.decorator';

@Controller('models')
export class ModelsController {
  constructor(
    private modelsService: ModelsService,
    private uploadedModelService: UploadedModelService, // private uploadedModelRepository: Repository<UploadedModel>,
  ) {}

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadModel(
    @UploadedFile() modelFile: Express.Multer.File,
    @Body('displayName') displayName: string,
    @Body('maxValue') maxValue: number,
    @Body('generateDoi') generateDoi: string,
    @Body('authors') authors: string,
    @Body('institution') institution: string,
    @Body('country') country: string,
    @Body('providedDoi') providedDoi: string,
    @Body('comments') comments: string,
    @AuthUser() user: any,
  ) {
    const filepath = `models/${modelFile.originalname.replace(
      /\.[^/.]+$/,
      '',
    )}`;

    /*
    const filename = `${new Date().getTime()}_${modelFile.originalname}`;
    const blobPath = `${filepath}/${filename}`;
    const response = await this.modelsService.uploadModelFileToBlob(
      modelFile,
      blobPath,
    );
    if (response.errorCode) {
      throw new HttpException(
        `Error uploading model file: ${response.errorCode}`,
        500,
      );
    }
    return blobPath;
    */

    // save metadata to db
    const model = new UploadedModel();
    model.title = displayName;
    model.description = comments || displayName;
    model.maxValue = maxValue;
    model.author = authors;
    model.source_country = country;
    model.affiliated_institution = institution;
    model.provided_doi = providedDoi;
    model.is_doi_requested = generateDoi === 'true';
    // model.uploaded_file_name = blobPath; // set uploaded file url
    const uploadResp = await this.uploadedModelService.firstUpload(
      model,
      modelFile,
      user?.sub,
    );

    // auto approve to generate a DOI
    await this.uploadedModelService.approve(
      model.id,
      'Auto approve model',
      user?.sub,
    );
    return model; // typeof uploadResp === 'string' ? uploadResp : uploadResp.filePath;
  }

  @Post('download')
  @Header('content-type', 'application/octet-stream')
  @HttpCode(HttpStatus.OK)
  async downloadModel(@Res() res, @Body('blobLocation') blobLocation: string) {
    const data = await this.modelsService.downloadModelFile(blobLocation);
    return data.pipe(res);
  }
}
