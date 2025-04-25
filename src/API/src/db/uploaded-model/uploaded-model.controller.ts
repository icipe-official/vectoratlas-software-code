import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { UploadedModelService } from './uploaded-model.service';
import { UploadedModel } from './entities/uploaded-model.entity';
import { AuthUser } from 'src/auth/user.decorator';
import { extractFileNameFromBlobUrl } from 'src/utils';
import { Readable } from 'stream';

@Controller('uploaded-model')
export class UploadedModelController {
  constructor(private readonly uploadedModelService: UploadedModelService) {}

  @Get()
  async findAll() {
    return await this.uploadedModelService.getUploadedModels();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.uploadedModelService.getUploadedModel(id);
  }

  @Patch(':id')
  async update(
    @AuthUser() user: any,
    @Param('id') id: string,
    @Body() uploadedModel: UploadedModel,
  ) {
    return await this.uploadedModelService.update(id, uploadedModel, user?.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.uploadedModelService.remove(id);
  }

  /**
   * Download raw dataset file
   */
  @Get('/download/:id')
  async download(@Res() res, @Param('id') id: string): Promise<StreamableFile> {
    const fileName = (await this.findOne(id)).uploaded_file_name;
    if (fileName.startsWith('http')) {
      const stream = await this.uploadedModelService.downloadFile(
        fileName,
        process.env.TEMP_DIR,
      );
      let fName = extractFileNameFromBlobUrl(fileName);
      if (fName.indexOf('/') != -1) {
        fName = fName.split('/')[1];
      }
      res.setHeader('Content-Disposition', `attachment; filename="${fName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      // stream.data.pipe(res);
      if (stream instanceof Readable) {
        stream.pipe(res);
      }
      return res;
    } else {
      const fName = fileName.split('/').pop();
      return res.download(`${fileName}`, fName);
    }
  }
}
