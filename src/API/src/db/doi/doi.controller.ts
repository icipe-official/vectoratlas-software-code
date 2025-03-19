import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DoiService } from './doi.service';
import { DOI } from './entities/doi.entity';
import { AuthUser } from 'src/auth/user.decorator';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/user_role/roles.guard';

@Controller('doi')
export class DoiController {
  constructor(private readonly doiService: DoiService) {}

  @Post()
  create(@Body() doi: DOI) {
    return this.doiService.upsert(doi);
  }

  @Get()
  findAll() {
    return this.doiService.getDOIs();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doiService.getDOI(id);
  }

  @Get('/resolver/:id')
  findOneByResolverId(@Param('id') id: string) {
    return this.doiService.getDOIByResolverID(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() doi: DOI) {
    return this.doiService.upsert(doi);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.doiService.remove(id);
  }

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.ReviewerManager)
  @Post('approve')
  async approveDOI(@AuthUser() user: any, @Query('id') id: string) {
    const doi = await this.findOne(id);
    if (doi) {
      return await this.doiService.approveDOI(doi.id, user?.sub);
    }
  }

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.ReviewerManager)
  @Post('reject')
  async rejectDOI(@AuthUser() user: any, @Query('id') id: string) {
    const doi = await this.findOne(id);
    if (doi) {
      return await this.doiService.rejectDOI(doi.id, user?.sub);
    }
  }
}
