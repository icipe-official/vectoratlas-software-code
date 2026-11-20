import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { SearchSiteQueryDto } from './dto/search-site-query.dto';
import { mapSitesToReturnItems } from './site-response.mapper';
import {
  parseStringArray,
  projectFields,
  parseSiteFields,
} from './site-search.utils';

@Controller('search')
export class SiteSearchController {
  constructor(private readonly siteService: SiteService) {}

  @Get('site')
  async search(@Query() query: SearchSiteQueryDto) {
    const fields = parseSiteFields(query.fields);

    if (query.id) {
      const site = await this.siteService.findOneById(query.id);
      if (!site) {
        throw new NotFoundException(`No site found with id "${query.id}".`);
      }
      const [mapped] = mapSitesToReturnItems([site]);
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
      adminLevel1: parseStringArray(query.adminLevel1),
      adminLevel2: parseStringArray(query.adminLevel2),
      areaType: parseStringArray(query.areaType),
    };

    const { items, total } = await this.siteService.findSites(
      take,
      skip,
      filters,
    );
    const mappedItems = mapSitesToReturnItems(items);

    return {
      items: mappedItems.map((item) => projectFields(item, fields)),
      total,
      hasMore: total > take + skip,
    };
  }
}
