import {
  Body,
  Controller,
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

}
