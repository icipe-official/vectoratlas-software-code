import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { SearchOccurrenceQueryDto } from './dto/search-occurrence-query.dto';
import { mapOccurrencesToReturnItems } from './occurrence-response.mapper';
import {
  parseStringArray,
  parseNullableStringArray,
  parseNullableBooleanArray,
  parseTimeline,
  parseFields,
  projectFields,
} from './search-query.utils';

/**
 * GET /search/:entityType
 * This controller only validates input, translates REST query params into the
 * OccurrenceFilter shape, delegates to the existing service, and formats
 * the response via the shared mapper (occurrence-response.mapper.ts) so
 * REST and GraphQL responses stay identical in shape.
 */
@Controller('search')
export class OccurrenceSearchController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

  @Get(':entityType')
  async search(
    @Param('entityType') entityType: string,
    @Query() query: SearchOccurrenceQueryDto,
  ) {
    // Manual validation
    if (entityType.toLowerCase() !== 'occurrence') {
      throw new BadRequestException(
        `Unsupported entity type "${entityType}". Only "occurrence" is currently supported.`,
      );
    }

    const fields = parseFields(query.fields);

    // Single-record lookup by id — bypasses filters/pagination entirely and
    // reuses the existing findOneById,
    if (query.id) {
      const occurrence = await this.occurrenceService.findOneById(query.id);
      if (!occurrence) {
        throw new NotFoundException(
          `No occurrence found with id "${query.id}".`,
        );
      }
      const [mapped] = mapOccurrencesToReturnItems(
        [occurrence],
        this.occurrenceService,
        true,
      );
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

    const filters: any = {
      country: parseStringArray(query.country),
      species: parseStringArray(query.species),
      season: parseNullableStringArray(query.season),
      insecticide: parseNullableStringArray(query.insecticide),
      binary_presence: parseNullableStringArray(query.absence),
      abundance_data: parseNullableStringArray(query.abundance),
      bionomics: parseNullableBooleanArray(query.bionomics)?.filter(
        (v) => v !== null,
      ),
      isAdult: parseNullableBooleanArray(query.adult),
      isLarval: parseNullableBooleanArray(query.larval),
      ...parseTimeline(query.timeline),
    };

    const bounds = { locationWindowActive: false };

    const { items, total } = await this.occurrenceService.findOccurrences(
      take,
      skip,
      filters,
      bounds as any,
      true,
    );

    const mappedItems = mapOccurrencesToReturnItems(
      items,
      this.occurrenceService,
      true,
    );

    return {
      items: mappedItems.map((item) => projectFields(item, fields)),
      total,
      hasMore: total > take + skip,
    };
  }
}
