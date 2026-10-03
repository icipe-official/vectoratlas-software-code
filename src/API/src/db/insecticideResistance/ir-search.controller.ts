import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InsecticideResistanceService } from './insecticideResistance.service';
import { SearchIrQueryDto } from './dto/search-ir-query.dto';
import { mapIrToReturnItems } from './ir-response.mapper';
import {
  parseStringArray,
  projectFields,
  parseIrFields,
} from './ir-search.utils';

@Controller('search')
export class IrSearchController {
  constructor(private readonly irService: InsecticideResistanceService) {}

  @Get('ir')
  async search(@Query() query: SearchIrQueryDto) {
    const fields = parseIrFields(query.fields);

    if (query.id) {
      const record = await this.irService.findOneById(query.id);
      if (!record) {
        throw new NotFoundException(
          `No IR record found with id "${query.id}".`,
        );
      }
      const [mapped] = mapIrToReturnItems([record]);
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

    let mortalityMin: number | undefined;
    let mortalityMax: number | undefined;
    if (query.mortalityMin !== undefined) {
      mortalityMin = parseFloat(query.mortalityMin);
      if (isNaN(mortalityMin))
        throw new BadRequestException('mortalityMin must be a number.');
    }
    if (query.mortalityMax !== undefined) {
      mortalityMax = parseFloat(query.mortalityMax);
      if (isNaN(mortalityMax))
        throw new BadRequestException('mortalityMax must be a number.');
    }

    const filters = {
      insecticideTested: parseStringArray(query.insecticideTested),
      insecticideClass: parseStringArray(query.insecticideClass),
      iracMoa: parseStringArray(query.iracMoa),
      mortalityMin,
      mortalityMax,
    };

    const { items, total } = await this.irService.findBioassays(
      take,
      skip,
      filters,
    );
    const mappedItems = mapIrToReturnItems(items);

    return {
      items: mappedItems.map((item) => projectFields(item, fields)),
      total,
      hasMore: total > take + skip,
    };
  }
}
