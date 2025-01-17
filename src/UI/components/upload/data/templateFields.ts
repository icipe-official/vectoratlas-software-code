import { Field } from '../importWizard/types';

export const OccurenceFields: Field<any>[] = [
  {
    label: 'Country',
    key: 'country',
    description: 'Country where data was collected',
    type: 'Select',
    options: [
      { label: 'Kenya', value: 'kenya' },
      { label: 'Uganda', value: 'uganda' },
    ],
    required: false,
    unique: false,
  },
  {
    label: 'Site',
    key: 'site',
    description: 'Region in the country where data was collected',
    type: 'Text',
    required: false,
    unique: false,
  },
  {
    label: 'Latitude 1',
    key: 'latitude_1',
    description: 'Latitude 1',
    type: 'Number',
  },
  {
    label: 'Longitude 1',
    key: 'longitude_1',
    description: 'Longitude 1',
    type: 'Number',
  },
];

export const BionomicsFields: Field<any>[] = [
  ...OccurenceFields,
  {
    label: 'Adult Data',
    key: 'adult_data',
    description: 'Information on adult vector',
    type: 'Boolean',
    required: false,
    unique: false,
  },
];

export const IRFields: Field<any>[] = [
  ...OccurenceFields,
  {
    label: 'Insecticide Control',
    key: 'insecticide control',
    description: 'Information on insecticide control',
    type: 'Boolean',
    required: false,
    unique: false,
  },
];
