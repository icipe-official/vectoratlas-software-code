import {
  Args,
  ArgsType,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Field,
  ObjectType,
  InputType,
} from '@nestjs/graphql';
import { Max, Min } from '@nestjs/class-validator';
import { OccurrenceService } from './occurrence.service';
import { Occurrence } from './entities/occurrence.entity';
import { Site } from '../shared/entities/site.entity';
import { SiteService } from '../shared/site.service';
import { RecordedSpecies } from '../shared/entities/recorded_species.entity';
import { RecordedSpeciesService } from '../shared/recordedSpecies.service';
import { Sample } from './entities/sample.entity';
import { SampleService } from './sample.service';
import PaginatedResponse from '../../pagination/pagination';
import { BionomicsService } from '../bionomics/bionomics.service';
import { Bionomics } from '../bionomics/entities/bionomics.entity';
import { Reference } from '../shared/entities/reference.entity';
import { ReferenceService } from '../shared/reference.service';
import { flattenOccurrenceRepoObject } from '../../export/utils/allDataCsvCreation';
import { OccurrenceReturn } from './occurrenceReturn';
import { randomUUID } from 'crypto';
import { DoiService } from '../doi/doi.service';
import { DoiController } from '../doi/doi.controller';
import { DOI } from '../doi/entities/doi.entity';
// import { DoiController } from 'src/doi/doi.controller';
// import { CreateDoiDto } from 'src/doi/dto/create-doi.dto';
// import { DoiService } from 'src/doi/doi.service';

export const occurrenceReturnPaginatedListClassTypeResolver = () =>
  PaginatedOccurrenceReturnData;
export const occurrencePaginatedListClassTypeResolver = () =>
  PaginatedOccurrenceData;
export const occurrencePaginatedCsvListClassTypeResolver = () =>
  PaginatedStringData;
export const occurrenceClassTypeResolver = () => Occurrence;
export const occurrenceListClassTypeResolver = () => [Occurrence];
export const siteClassTypeResolver = () => Site;
export const sampleClassTypeResolver = () => Sample;
export const bionomicsClassTypeResolver = () => Bionomics;
export const referenceClassTypeResolver = () => Reference;
export const recordedSpeciesClassTypeResolver = () => RecordedSpecies;
export const integerTypeResolver = () => Number;
export const floatTypeResolver = () => Number;
export const coordsArrayTypeResolver = () => [Coord];
export const stringListTypeResolver = () => [String];
export const booleanTypeResolver = () => Boolean;

@ObjectType()
class PaginatedOccurrenceData extends PaginatedResponse(Occurrence) {}
@ObjectType()
class PaginatedOccurrenceReturnData extends PaginatedResponse(
  OccurrenceReturn,
) {}

@ObjectType()
class PaginatedStringData extends PaginatedResponse(String) {}

@ArgsType()
export class GetOccurrenceDataArgs {
  @Field(integerTypeResolver, { nullable: true, defaultValue: 1 })
  @Min(1)
  @Max(100)
  take: number;

  @Field(integerTypeResolver, { nullable: true, defaultValue: 0 })
  @Min(0)
  skip: number;
}
export const stringArrayTypeResolver = () => [String];
export const booleanArrayTypeResolver = () => [Boolean];

@ArgsType()
export class GetFullOccurrenceDataArgs {
  @Field(stringListTypeResolver, { nullable: false })
  selectedIds: string[];
}

@InputType()
export class OccurrenceFilter {
  @Field(stringArrayTypeResolver, { nullable: true })
  country?: [string];

  @Field(stringArrayTypeResolver, { nullable: true })
  species?: [string];

  @Field(stringArrayTypeResolver, { nullable: 'itemsAndList' })
  insecticide?: (string | null)[];

  @Field(booleanArrayTypeResolver, { nullable: 'itemsAndList' })
  bionomics?: boolean[];

  @Field(booleanArrayTypeResolver, { nullable: 'itemsAndList' })
  isLarval?: (boolean | null)[];

  @Field(booleanArrayTypeResolver, { nullable: 'itemsAndList' })
  isAdult?: (boolean | null)[];

  @Field(booleanArrayTypeResolver, { nullable: 'itemsAndList' })
  control?: (boolean | null)[];

  @Field(stringArrayTypeResolver, { nullable: 'itemsAndList' })
  season?: (string | null)[];

  @Field(integerTypeResolver, { nullable: true })
  startTimestamp?: number;

  @Field(integerTypeResolver, { nullable: true })
  endTimestamp?: number;
}

@InputType()
export class Coord {
  @Field(floatTypeResolver, { nullable: true })
  lat: number;
  @Field(floatTypeResolver, { nullable: true })
  long: number;
}

@InputType()
export class BoundsFilter {
  @Field(booleanTypeResolver, { nullable: false })
  locationWindowActive: boolean;

  @Field(coordsArrayTypeResolver, { nullable: true })
  coords?: Coord[];
}

@Resolver(occurrenceClassTypeResolver)
export class OccurrenceResolver {
  constructor(
    private occurrenceService: OccurrenceService,
    private siteService: SiteService,
    private sampleService: SampleService,
    private bionomicsService: BionomicsService,
    private referenceService: ReferenceService,
    private recordedSpeciesService: RecordedSpeciesService,
    private doiService: DoiService,
  ) {}

  @Query(occurrenceReturnPaginatedListClassTypeResolver)
  async OccurrenceData(
    @Args() { take, skip }: GetOccurrenceDataArgs,
    @Args({ name: 'filters', type: () => OccurrenceFilter, nullable: true })
    filters?: OccurrenceFilter,
    @Args({ name: 'bounds', type: () => BoundsFilter, nullable: true })
    bounds?: BoundsFilter,
    recordDownload?: boolean,
    minimalFields = true,
  ) {
    const { items, total } = await this.occurrenceService.findOccurrences(
      take,
      skip,
      filters,
      bounds,
      minimalFields,
    );
    if (recordDownload) {
      await this.occurrenceService.incrementDownload(items);
    }

    const relationObject = this.occurrenceService.getOccurrenceFields(true);
    const excludeColumns = {
      parent: [],
      relations: {
        // dataset: '*',
        dataset: [
          'id',
          'status',
          'UpdatedBy',
          'UpdatedAt',
          'ReviewedBy',
          'ReviewedAt',
          'ApprovedBy',
          'ApprovedAt',
        ],
        site: ['longitude_4', 'longitude_5'],
      },
    };

    const includeColumn = (
      isParentProperty: boolean,
      relationName: string,
      columnName: string,
    ) => {
      let cols: any;
      if (isParentProperty) {
        cols = excludeColumns['parent'];
      } else {
        cols = excludeColumns['relations'][relationName];
      }

      if (cols === '*') return false;
      if (Array.isArray(cols) && cols.includes(columnName)) return false;
      return true;
    };

    /**
     * Include other fields in addition to those specified in the Interface
     * extend to other relations. This contradicts strict typing requirements of OccurrenceReturn but it
     * was necessary so that we allow inclusion of related fields dynamically
     * extended fields will be renamed to `relationName_relationFieldName`
     */
    const selectAllFields = (record: object, destinationObject: object) => {
      Object.keys(record).map((dataProperty) => {
        // check if fld is a relation. If yes, loop through all fields for the relation
        if (Object.keys(relationObject).includes(dataProperty)) {
          const relationFields = relationObject[dataProperty];
          relationFields.map((relationField) => {
            if (
              relationField === 'id' ||
              !includeColumn(false, dataProperty, relationField)
            ) {
              // do nothing since field should not be included
            } else {
              const key = `${dataProperty}_${relationField}`;
              Object.assign(destinationObject, {
                [key]: record?.[dataProperty]?.[relationField] || null,
              });
            }
          });
        } else {
          if (includeColumn(true, null, dataProperty)) {
            Object.assign(destinationObject, {
              [dataProperty]: record?.[dataProperty],
            });
          }
        }
      });
      return destinationObject;
    };

    const returnItems: OccurrenceReturn[] = items.map((x) => {
      const obj = {
        id: x.id,
        species: x.recordedSpecies.species,
        location: x.site.location,
      };

      // extend to other relations. This contradicts strict typing requirements but it
      // was necessary so that we allow inclusion of related fields dynamically
      if (!minimalFields) {
        const extendedObject = selectAllFields(x, obj);
        Object.assign(obj, extendedObject);
      }
      return obj;
    });
    return Object.assign(new PaginatedOccurrenceData(), {
      items: returnItems,
      total,
      hasMore: total > take + skip,
    });
  }

  @Query(occurrenceListClassTypeResolver)
  async FullOccurrenceData(@Args() { selectedIds }: GetFullOccurrenceDataArgs) {
    return await this.occurrenceService.findOccurrencesByIds(selectedIds);
  }

  @Query(occurrencePaginatedCsvListClassTypeResolver)
  async OccurrenceCsvData(
    @Args() { take, skip }: GetOccurrenceDataArgs,
    @Args({ name: 'filters', type: () => OccurrenceFilter, nullable: true })
    filters?: OccurrenceFilter,
    @Args({ name: 'bounds', type: () => BoundsFilter, nullable: true })
    bounds?: BoundsFilter,
  ) {
    const pageOfData = await this.OccurrenceData(
      { take, skip },
      filters,
      bounds,
      true,
      false, //set to false in order to load all data including relations
    );
    const flattenedRepoObject = flattenOccurrenceRepoObject(pageOfData.items);
    const headers = Object.keys(flattenedRepoObject[0]).join(',');

    /**
     * Make a filters row
     */
    const makeFiltersRow = async () => {
      const rows = Array<string>();
      const colCount = headers.split(',').length;
      if (filters) {
        rows.push('Filters:' + ','.repeat(colCount - 1));
        Object.keys(filters).forEach((element) => {
          const val = filters[element];
          rows.push(`,${element},${val}` + ','.repeat(colCount - 3));
        });

        // generate DOI
        /*const dto = {} as CreateDoiDto;
        dto.filters = filters;
        const doi = new DoiController(new DoiService()).create(dto);*/

        const doiObj = await saveDOI();
        const res = await this.doiService.upsert(doiObj);
        const doi = await this.doiService.generateDOI(res);
        // const doiLink = `http://dx.doi.org/${randomUUID()}`;
        rows.push('DOI:' + `,${doi?.data?.id}`);
      }
      return rows;
    };

    const saveDOI = async () => {
      const doi = new DOI(); // this.doiService.generateDOI(DOI);
      doi.creator_email = 'stevenyaga@gmail.com';
      doi.creator_name = 'Steve Nyaga';
      doi.publication_year = 2024;
      doi.title = 'Sample title';
      doi.description = 'Sample description';
      doi.source_type = 'Download';
      doi.meta_data = {
        fields: headers.split(','), // ['dataset.id', 'dataset.doi', 'bionomics.year_start'],
        filters: filters,
      };
      const res = await this.doiService.upsert(doi);
      return res;
    };

    const emptyRow = ','.repeat(headers.split(',').length);

    const filtersRows = await makeFiltersRow();
    /**
     * Format csv rows to ensure correct export and display
     * For column values containing a comma, enclose the value with double quote
     */
    const formatRow = (row: object) => {
      const vals = Object.values(row).map((val: object) => {
        let strVal = val?.toString();
        const hasComma = strVal?.includes(',');
        //val?.toString().replace(/,/g, '');// replace comma
        strVal = strVal?.replace(/\"/g, '""'); //escape double quotes
        return hasComma ? '"' + strVal + '"' : strVal; //enclose string if it has a comma
      });
      return vals.join(',');
    };

    const csvRows = flattenedRepoObject.map((row) => {
      return formatRow(row);
      // return Object.values(row).join(','),
    });

    return Object.assign(new PaginatedStringData(), {
      items: [...filtersRows, emptyRow, headers, ...csvRows],
      total: pageOfData.total,
      hasMore: pageOfData.hasMore,
    });
  }

  @ResolveField('site', siteClassTypeResolver)
  async getSite(@Parent() parent: Occurrence): Promise<Site> {
    return await this.siteService.findOneById(parent.site.id);
  }

  @ResolveField('sample', sampleClassTypeResolver, { nullable: true })
  async getSample(@Parent() parent: Occurrence): Promise<Sample | null> {
    if (parent.sample) {
      return await this.sampleService.findOneById(parent.sample.id);
    }
    return null;
  }

  @ResolveField('bionomics', () => Bionomics, { nullable: true })
  async getBionomics(@Parent() parent: Occurrence): Promise<Bionomics | null> {
    if (parent.bionomics) {
      return await this.bionomicsService.findOneById(parent.bionomics.id);
    }
    return null;
  }

  @ResolveField('reference', referenceClassTypeResolver)
  async getReference(@Parent() parent: Occurrence): Promise<Reference> {
    return await this.referenceService.findOneById(parent.reference.id);
  }

  @ResolveField('recorded_species', recordedSpeciesClassTypeResolver)
  async getRecordedSpecies(
    @Parent() parent: Occurrence,
  ): Promise<RecordedSpecies> {
    return await this.recordedSpeciesService.findOneById(
      parent.recordedSpecies.id,
    );
  }
}
