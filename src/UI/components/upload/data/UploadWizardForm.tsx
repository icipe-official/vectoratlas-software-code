import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { formatDate } from '../../../utils/utils';
import {
  ERROR_COLUMN_NAME,
  Field,
  ImportWizardState,
  SelectFieldOption,
} from '../importWizard/types';
import { SpreadsheetImporter } from '../importWizard';
import { countryList } from '../../../state/map/utils/countrySpeciesLists';
import { useAppDispatch } from '../../../state/hooks';
import { uploadData } from '../../../state/upload/actions/uploadData';
import { useRouter } from 'next/router';
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  BionomicsFields,
  IRFields,
  OccurenceFields,
  CombinedFields,
} from './templateFields';

const FieldIDs = {
  datasetId: 'datasetId',
  dataType: 'dataType',
  dataSource: 'dataSource',
  doi: 'doi',
  title: 'title',
  description: 'description',
  country: 'country',
  region: 'region',
  generateDoi: 'generateDoi',
  dataFile: 'dataFile',
};

const DatasetType = {
  Occurrence: 'Occurrence',
  OccurrenceBionomics: 'Occurrence & Bionomics',
  OccurrenceIR: 'Occurrence & Insecticide Resistance',
  Complete: 'Occurrence, Bionomics & Insecticide Resistance',
};

const UploadWizardForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [fields, setFields] = useState<Field<any>[]>([]);
  const [datasetType, setDatasetType] = useState(DatasetType.Occurrence);

  const countries: SelectFieldOption[] = ['', ...countryList].map((el) => {
    return { label: el, value: el === '' ? null : el };
  });

  const handleDataTypeChange = (
    evt: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    setDatasetType(evt.target.value);
  };

  const uploadDataset = async (state: ImportWizardState) => {
    // construct a file
    const makeFile = () => {
      let validData = state.transformedData.filter(
        (row) => Object.keys(JSON.parse(row[ERROR_COLUMN_NAME])).length == 0
      );
      const fileName = `${
        state.metadata?.['title'] + formatDate(new Date())
      }.xlsx`;
      // delete errors column after skipping the header column
      validData = validData.slice(1).map(({ _errors, ...item }) => item);
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(validData);
      // delete ws[ERROR_COLUMN_NAME];
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

      const binary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      const file = new File([binary], fileName, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      // XLSX.writeFile(wb, fileName);
      return file;
    };

    const doUpload = async () => {
      const metadata = { ...state.metadata };
      const dSetType = Object.keys(state.preImportValues || {}).includes(
        'datasetType'
      )
        ? state.preImportValues?.['datasetType']
        : '';
      const file = makeFile();
      await dispatch(
        uploadData({
          datasetId: metadata?.[FieldIDs.datasetId],
          dataType: dSetType, // metadata?.[FieldIDs.dataType],
          dataSource: metadata?.[FieldIDs.dataSource],
          doi: metadata?.[FieldIDs.doi],
          title: metadata?.[FieldIDs.title],
          description: metadata?.[FieldIDs.description],
          country: metadata?.[FieldIDs.country],
          region: '', // metadata?.[FieldIDs.region],
          generateDoi: metadata?.[FieldIDs.generateDoi],
          dataFile: file,
        })
      );
    };

    await doUpload();
  };

  useEffect(() => {
    switch (datasetType) {
      case DatasetType.Occurrence:
        setFields(OccurenceFields);
        break;
      case DatasetType.OccurrenceBionomics:
        setFields(BionomicsFields);
        break;
      case DatasetType.OccurrenceIR:
        setFields(IRFields);
        break;
      case DatasetType.Complete:
        setFields(CombinedFields);
        break;
      default:
        setFields([]);
        break;
    }
  }, [datasetType]);

  return (
    <>
      <SpreadsheetImporter
        fields={fields}
        metadataFields={[
          {
            type: 'Text',
            label: 'Dataset Title',
            key: FieldIDs.title,
            required: true,
            // helperText: 'Short description of the dataset',
          },
          {
            type: 'TextArea',
            label: 'Description',
            key: FieldIDs.description,
            required: true,
            // helperText: 'Description of the dataset',
          },
          {
            type: 'Select',
            label: 'Country of Uploader',
            key: FieldIDs.country,
            required: true,
            options: countries,
          },
          // {
          //   type: 'Text',
          //   label: 'Dataset Id (if known)',
          //   key: FieldIDs.datasetId,
          //   required: false,
          //   helperText: 'Dataset Id of previously uploaded dataset',
          // },
          {
            type: 'Text',
            label: 'DOI/Citation (if exists)',
            key: FieldIDs.doi,
            required: false,
            helperText: 'Enter DOI or citations referencing this datataset',
          },
        ]}
        preImportStepLabel={'Select Data Type'}
        preImportComponent={
          <FormControl key={'1'} style={{ width: '90%', padding: 10 }}>
            <FormLabel key={'2'}>Select Dataset Type</FormLabel>
            <Select
              key={'3'}
              onChange={(evt: SelectChangeEvent) => handleDataTypeChange(evt)}
              value={datasetType}
            >
              <MenuItem key={'4'} value={DatasetType.Occurrence}>
                {DatasetType.Occurrence}
              </MenuItem>
              <MenuItem key={'5'} value={DatasetType.OccurrenceBionomics}>
                {DatasetType.OccurrenceBionomics}
              </MenuItem>
              <MenuItem key={'6'} value={DatasetType.OccurrenceIR}>
                {DatasetType.OccurrenceIR}
              </MenuItem>
              <MenuItem key={'7'} value={DatasetType.Complete}>
                {DatasetType.Complete}
              </MenuItem>
            </Select>
          </FormControl>
        }
        preImportStepHook={async (state) => {
          if (!state.preImportValues) {
            state.preImportValues = {};
          }
          state.preImportValues['datasetType'] = datasetType;

          console.log('Pre-import Step completed with state...', state);
        }}
        uploadStepHook={async (state) => {
          console.log('Upload Step completed with state...', state);
        }}
        selectHeaderStepHook={async (state) => {
          console.log('Select Header Step completed with state...', state);
        }}
        validateDataStepHook={async (state) => {
          console.log('User has validated data with state: ', state);
        }}
        metadataStepHook={async (state) => {
          console.log('User has completed metadata with state: ', state);
        }}
        onFinish={async (state) => {
          console.log('User has finished with state: ', state);
          // will do uploading of dataset here
          await uploadDataset(state);
          router.push({
            pathname: '/',
          });
        }}
        autoMapHeaders={true}
        autoMapDistance={2}
      />
    </>
  );
};

export default UploadWizardForm;
