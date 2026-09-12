import { Occurrence } from './entities/occurrence.entity';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceReturn } from './occurrenceReturn';

export function mapOccurrencesToReturnItems(
  items: Occurrence[],
  occurrenceService: OccurrenceService,
  minimalFields = true,
): OccurrenceReturn[] {
  const relationObject = occurrenceService.getOccurrenceFields(true);
  const excludeColumns = {
    parent: [],
    relations: {
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

  const selectAllFields = (record: object, destinationObject: object) => {
    Object.keys(record).map((dataProperty) => {
      if (Object.keys(relationObject).includes(dataProperty)) {
        const relationFields = relationObject[dataProperty];
        relationFields.map((relationField) => {
          if (
            relationField === 'id' ||
            !includeColumn(false, dataProperty, relationField)
          ) {
            // omitted
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

  return items.map((x) => {
    const obj = {
      id: x.id,
      species: x.recordedSpecies.species,
      location: x.site.location,
      binary_presence: x.binary_presence,
      country: x.site.country,
      year_start: x.year_start,
      is_adult: !!x.adult_data,
      is_larval: x.larval_data === 'True',
      season_val: x.season_calc || x.season_given || '',
      insecticide: x.insecticide_resistance_data,
      control: x.sample?.control?.toString() || '',
      abundance_data: x.abundance_data,
      bio_data: x.bio_data,
      display_name: x.recordedSpecies?.display_name,
      category: x.recordedSpecies?.category,
      color: x.recordedSpecies?.color,
      //has_bionomics: x.bio_data,
    };

    if (!minimalFields) {
      const extendedObject = selectAllFields(x, obj);
      Object.assign(obj, extendedObject);
    }
    return obj;
  });
}
