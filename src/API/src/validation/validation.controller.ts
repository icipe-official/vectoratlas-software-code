import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { ValidationService } from './validation.service';

@Controller('validation')
export class ValidationController {
  constructor(private validationService: ValidationService) {}

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('validateUploadBionomics')
  @UseInterceptors(FileInterceptor('file'))
  async validateBionomicsCsv(
    @UploadedFile() bionomicsCsv: Express.Multer.File,
  ) {
    const res = await this.validationService.validateBionomicsCsv(
      bionomicsCsv.buffer.toString(),
    );
    return res;
  }

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('validateUploadOccurrence')
  @UseInterceptors(FileInterceptor('file'))
  async validateOccurrenceCsv(
    @UploadedFile() occurrenceCsv: Express.Multer.File,
  ) {
    const res = await this.validationService.validateOccurrenceCsv(
      occurrenceCsv.buffer.toString(),
    );
    return res;
  }
}
