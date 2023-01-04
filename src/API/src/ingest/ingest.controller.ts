import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/auth/user.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(private ingestService: IngestService) {}

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('uploadBionomics')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBionomicsCsv(@AuthUser() user: any, @UploadedFile() bionomicsCsv: Express.Multer.File) {
    const userId = user.sub;
    await this.ingestService.saveBionomicsCsvToDb(
      bionomicsCsv.buffer.toString(),
      userId 
    );
  }

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('uploadOccurrence')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOccurrenceCsv(
    @AuthUser() user: any,
    @UploadedFile() occurrenceCsv: Express.Multer.File,
    ) {
    const userId = user.sub;
    await this.ingestService.saveOccurrenceCsvToDb(
      occurrenceCsv.buffer.toString(),
      userId,
    );
  }
}
