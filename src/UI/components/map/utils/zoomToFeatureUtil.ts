import { MapFilter } from '../../../state/state.types';
import Map from 'ol/Map';
import { african_countries_extents } from './african_country_extents';
import { transformExtent } from 'ol/proj';

export interface African_countries_extents {
  [key: string]: number[];
}
export function getCombinedExtent(extents: number[][] | string): number[] {
  if (extents.length === 0) {
    return [];
  }
  if (typeof extents === 'string') return [];

  const minX = Math.min(...extents.map((extent) => extent[0]));
  const minY = Math.min(...extents.map((extent) => extent[1]));
  const maxX = Math.max(...extents.map((extent) => extent[2]));
  const maxY = Math.max(...extents.map((extent) => extent[3]));

  return [minX, minY, maxX, maxY];
}

export function matchObjectKeys(
  search: any[],
  obj: African_countries_extents
): number[][] {
  const matchingValues: number[][] = [];
  const keys = Object.keys(obj);
  for (const key of keys) {
    for (const term of search) {
      if (key.toLowerCase().includes(term.toLowerCase())) {
        matchingValues.push(obj[key]);
        break;
      }
    }
  }
  return matchingValues;
}

export function zoomToSelectedCountries(
  country_filters: MapFilter<string | string[]>,
  map: Map | null
) {
  if (!map) {
    return;
  }
  if (
    country_filters.value.length > 0 &&
    typeof country_filters.value != 'string'
  ) {
    map?.getView().fit(
      transformExtent(
        getCombinedExtent(
          matchObjectKeys(
            country_filters.value.map((current_country) =>
              current_country.replace(/\s/g, '')
            ),
            african_countries_extents
          )
        ),
        'EPSG:4326',
        'EPSG:3857'
      ),
      { duration: 700, padding: [50, 50, 50, 50] }
    );
  }
}
