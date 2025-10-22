import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { Occurrence } from './entities/occurrence.entity';

@Controller('occurrence')
export class OccurrenceController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

@Post('modifyPointData')
async modifyPointData(@Body() body: any): Promise<{ status: string; occurrence: Occurrence }> {
  return this.occurrenceService.modifyPointData(body);
}

@Get('getPointData/:entityType/:occurrenceId')
async getPointData(
  @Param('entityType') entityType: string,
  @Param('occurrenceId') occurrenceId: string
) {
  console.log("entityType: ", entityType);
    console.log("occurrenceId: ", occurrenceId);
  return this.occurrenceService.getPointData(entityType, occurrenceId);
}

@Get('getPointDataBySource/:sourceId')
async getPointDataBySource(@Param('sourceId') sourceId: string) {
  return this.occurrenceService.getPointDataBySource(sourceId);
}

@Post('modifyFullPointData')
async modifyFullPointData(@Body() data: { body: any; entityType: string; editor: any; reasonForEdit: any }) {
  return this.occurrenceService.modifyFullPointData(data.body, data.entityType, data.editor, data.reasonForEdit);
}

}
