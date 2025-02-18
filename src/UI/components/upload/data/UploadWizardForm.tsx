import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as XLSX from 'xlsx';
import { formatDate } from '../../../utils/utils';
import {
  DatasetType,
  ERROR_COLUMN_NAME,
  Field,
  ImportWizardState,
  initialWizardState,
  SelectFieldOption,
} from '../importWizard/types';
import { SpreadsheetImporter } from '../importWizard';
import { countryList } from '../../../state/map/utils/countrySpeciesLists';
import { useAppDispatch } from '../../../state/hooks';
import { uploadData } from '../../../state/upload/actions/uploadData';
import { useRouter } from 'next/router';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
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
import { StepType } from '../importWizard/ImportWizard';
import { useSpreadsheetImporter } from '../importWizard/hooks/useSpreadsheetImporter';

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

interface PreImportProps {
  // stateUpdater: (state: ImportWizardState) => void;
  // state: ImportWizardState;
  // validator: (state: ImportWizardState) => void;
}

export interface PreImportComponentRef {
  getDatasetType: () => string;
  getTermsChecked: () => boolean;
  getState: () => ImportWizardState;
}

// const PreImportComponent = forwardRef((props, ref) => {
const PreImportComponent = forwardRef<PreImportComponentRef, PreImportProps>(
  (props: PreImportProps, ref) => {
    const [datasetType, setDatasetType] = useState(DatasetType.Occurrence);
    const [termsChecked, setTermsChecked] = useState(false);

    const { initialState } = useSpreadsheetImporter();
    const [state, setState] = useState<ImportWizardState>(
      initialState || initialWizardState
    );

    const handleDataTypeChange = (
      evt: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>
    ) => {
      setDatasetType(evt.target.value);
    };

    const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTermsChecked(event.target.checked);
    };

    // const initializeState = useCallback(() => {
    //   if (!state?.preImportValues) {
    //     state.preImportValues = { dataType: '', hasAgreedTerms: false };
    //   }
    // }, [state]);

    useEffect(() => {
      if (!state?.preImportValues) {
        state.preImportValues = { dataType: '', hasAgreedTerms: false };
      }
      state.preImportValues.hasAgreedTerms = termsChecked;
    }, [state, termsChecked]);

    useEffect(() => {
      if (!state?.preImportValues) {
        state.preImportValues = { dataType: '', hasAgreedTerms: false };
      }
      state.preImportValues['dataType'] = datasetType;
    }, [datasetType, state]);

    useImperativeHandle(ref, () => ({
      getDatasetType: () => {
        return datasetType;
      },
      getTermsChecked: () => {
        return termsChecked;
      },
      getState: () => {
        return state;
      },
    }));

    return (
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
        <FormControlLabel
          style={{
            marginTop: 10,
          }}
          label="Dataset uploaded to Vector Atlas becomes available to the public under Creative Commons licence. Do you agree to the terms?"
          control={
            <Checkbox
              checked={termsChecked}
              onChange={handleTermsChange}
              // onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              //   if (!state.preImportValues) {
              //     state.preImportValues = { dataType: '', hasAgreedTerms: false };
              //   }
              //   state.preImportValues.hasAgreedTerms = evt.target.checked;
              // }}
            />
          }
        />
      </FormControl>
    );
  }
);

PreImportComponent.displayName = 'PreImportComponent';

const UploadWizardForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [fields, setFields] = useState<Field<any>[]>([]);
  const [datasetType, setDatasetType] = useState(DatasetType.Occurrence);
  // const [datasetType, setDatasetType] = useState(DatasetType.Occurrence);

  const [state, setState] =
    React.useState<ImportWizardState>(initialWizardState);

  const preImportRef = createRef<PreImportComponentRef>();

  const countries: SelectFieldOption[] = ['', ...countryList].map((el) => {
    return { label: el, value: el === '' ? null : el };
  });

  const handleDataTypeChange = (
    evt: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    setDatasetType(evt.target.value);
  };

  const uploadDataset = async (state: ImportWizardState) => {
    console.log('Final state: ', state);
    // construct a file
    const makeFile = () => {
      let validData;
      if (state.transformedData.length > 0) {
        validData = state.transformedData.filter(
          (row) => Object.keys(JSON.parse(row[ERROR_COLUMN_NAME])).length == 0
        );
      } else {
        // the user may have skipped some steps
        validData = state.rawRecords;
      }

      const fileName = `${
        state.metadata?.['title'] + formatDate(new Date())
      }.xlsx`;
      // delete errors column after skipping the header column
      validData = validData.slice(1).map(({ _errors, ...item }) => item);
      let finalHeaders = state.headers;
      let ws = XLSX.utils.json_to_sheet(validData, { header: finalHeaders });
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
      const binary = XLSX.write(wb, { bookType: 'csv', type: 'binary' });
      /*
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(validData);
      // delete ws[ERROR_COLUMN_NAME];
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

      const binary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
      */
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
        ? state.preImportValues?.dataType
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
        initialState={state}
        targetFields={fields}
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
        preImportComponent={<PreImportComponent ref={preImportRef} />}
        preImportStepHook={async (state: ImportWizardState) => {
          const agreedTerms = state.preImportValues?.hasAgreedTerms;
          setDatasetType(state.preImportValues?.dataType || 'Occurrence');
          console.log('Pre-import Step completed with state...', state);
          // if (!state.preImportValues?.hasAgreedTerms) {
          if (agreedTerms !== true) {
            throw new Error('You must agree to the terms');
          }
        }}
        preImportStepContinueValitor={async (state: ImportWizardState) => {
          return (await state.preImportValues?.hasAgreedTerms) || undefined;
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
        optionalSteps={[
          StepType.selectHeader,
          StepType.matchColumns,
          StepType.validateData,
        ]}
      />
    </>
  );
};

export default UploadWizardForm;
