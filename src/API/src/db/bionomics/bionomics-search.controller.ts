import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { BionomicsService } from './bionomics.service';
import { SearchBionomicsQueryDto } from './dto/search-bionomics-query.dto';
import { mapBionomicsToReturnItems } from './bionomics-response.mapper';
import {
  parseStringArray,
  parseNullableBooleanArray,
  parseTimeline,
  projectFields,
  parseBionomicsFields,
} from './bionomics-search.utils';

@Controller('search')
export class BionomicsSearchController {
  constructor(private readonly bionomicsService: BionomicsService) {}

  @Get('bionomics')
  async search(@Query() query: SearchBionomicsQueryDto) {
    const fields = parseBionomicsFields(query.fields);

    if (query.id) {
      const record = await this.bionomicsService.findOneById(query.id);
      if (!record) {
        throw new NotFoundException(
          `No bionomics record found with id "${query.id}".`,
        );
      }
      const [mapped] = mapBionomicsToReturnItems([record]);
      return {
        items: [projectFields(mapped, fields)],
        total: 1,
        hasMore: false,
      };
    }

    const take = query.take ? parseInt(query.take, 10) : 100;
    const skip = query.skip ? parseInt(query.skip, 10) : 0;
    if (isNaN(take) || take < 1 || take > 5000) {
      throw new BadRequestException(
        'take must be a number between 1 and 5000.',
      );
    }
    if (isNaN(skip) || skip < 0) {
      throw new BadRequestException('skip must be a number >= 0.');
    }

    const filters = {
      country: parseStringArray(query.country),
      season: parseStringArray(query.season),
      control: parseStringArray(query.control),
      insecticideControl: parseNullableBooleanArray(
        query.insecticideControl,
      )?.filter((v) => v !== null),
      itnUse: parseNullableBooleanArray(query.itnUse)?.filter(
        (v) => v !== null,
      ),
      ...parseTimeline(query.timeline),
    };

    const { items, total } = await this.bionomicsService.findBionomics(
      take,
      skip,
      filters,
    );
    const mappedItems = mapBionomicsToReturnItems(items);

    return {
      items: mappedItems.map((item) => projectFields(item, fields)),
      total,
      hasMore: total > take + skip,
    };
  }
}
