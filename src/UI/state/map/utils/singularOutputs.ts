import { VectorAtlasFilters } from '../../state.types';

export function singularOutputs(filters: VectorAtlasFilters) {
  const updatedFilters = JSON.parse(JSON.stringify(filters));
  updatedFilters.season.value = filters.season.value[0];
  updatedFilters.control.value = filters.control.value[0];
  updatedFilters.isAdult.value = filters.isAdult.value[0];
  updatedFilters.isLarval.value = filters.isLarval.value[0];
  return updatedFilters;
}
