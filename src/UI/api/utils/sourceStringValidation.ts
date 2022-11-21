import { NewSource } from '../../components/sources/source_form';

export function sourceStringValidation(sourceObject: any) {
  Object.keys(sourceObject).forEach((field) => {
    sourceObject[field] = sourceObject[field].replace(/(^|[^\\])"/g, '$1\\"');
  });
  return sourceObject;
}

// export const queryFilterMapper = (filters: any) => {
//   const queryFilters: {
//     [name: string]: number | string | string[] | boolean[] | null;
//   } = {};

//   Object.keys(filters).forEach((f) => {
//     if (f === 'timeRange') {
//       if (filters[f].value && filters[f].value.start) {
//         queryFilters.startTimestamp = filters[f].value.start;
//       }
//       if (filters[f].value && filters[f].value.end) {
//         queryFilters.endTimestamp = filters[f].value.end;
//       }
//     } else if (filters[f].value) {
//       queryFilters[f] =
//         filters[f].value === 'empty'
//           ? null
//           : (filters[f].value as number | string | string[] | boolean[] | null);
//     }
//   });

//   return queryFilters;
// };
