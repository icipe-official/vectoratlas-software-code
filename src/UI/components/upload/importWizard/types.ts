import { RenderCellProps } from 'react-data-grid';
import * as XLSX from 'xlsx';
import { StepType } from './ImportWizard';

export type ImportWizardProps<T extends string> = {
  // Field description for requested data
  targetFields?: Fields<T>;

  // runs after pre-import step. ImportWizardState is supplied as a parameter
  preImportStepHook?: (state: ImportWizardState) => Promise<any>;

  // validator to allow moving past preimport step
  preImportStepContinueValitor?: (
    state: ImportWizardState
  ) => Promise<boolean | undefined>;

  // runs after file upload. ImportWizardState is supplied as a parameter
  uploadStepHook?: (state: ImportWizardState) => Promise<any>;

  // Runs after header selection step. ImportWizardState is supplied as a parameter
  selectHeaderStepHook?: (state: ImportWizardState) => Promise<any>;

  // Runs after matching columns. ImportWizardState is supplied as a parameter
  matchColumnsStepHook?: (state: ImportWizardState) => Promise<any>;

  // Runs after validate data step. ImportWizardState is supplied as a parameter
  validateDataStepHook?: (state: ImportWizardState) => Promise<any>;

  // Runs after metadata step. ImportWizardState is supplied as a parameter
  metadataStepHook?: (state: ImportWizardState) => Promise<any>;

  // Sets SheetJS "raw" option. If true, parsing will only be applied to xlsx date fields.
  parseRaw?: boolean;

  // Specifies maximum number of rows for a single import
  maxRecords?: number;

  // Extra steps that are to be appended to the import wizard.
  // @TODO. This is not completed yet
  extraSteps?: ExtraWizardStep[];

  // component that is pre-pended before import process begins
  preImportComponent?: React.ReactNode;

  // Fields capturing metadata of the dataset
  metadataFields?: MetadataField[];

  // Called when user completes the wizard process. ImportWizardState is supplied as a parameter
  onFinish: (state: ImportWizardState) => Promise<void>;

  // Initial state to be rendered on load
  initialState?: ImportWizardState;

  // Automatically map imported headers to specified fields if possible. Default: true
  autoMapHeaders?: boolean;
  // Headers matching accuracy: 1 for strict and up for more flexible matching
  autoMapDistance?: number;

  // label for the pre-import step
  preImportStepLabel?: string;

  // optional steps
  optionalSteps?: StepType[];
};

export type InputFieldTypes = 'Text' | 'Select' | 'TextArea';

export type MetadataField = {
  key: string; // unique id/name of the field
  type: InputFieldTypes;
  label: string; // Label of the field
  value?: any; // Default value
  helperText?: string; // Helper text
  required?: boolean; // is the field required
  options?: SelectFieldOption[]; //options for select field
};

export type SelectFieldOption = {
  label: string;
  value: any;
};

export type ExtraWizardStep = {
  key: string;
  component: React.ReactNode;
};

export type RawData = Array<string | undefined>;

// Data model RSI uses for spreadsheet imports
export type Fields<T extends string> = Field<T>[];

export type FieldType = 'Text' | 'Number' | 'Select' | 'Boolean';

export type Field<T extends string> = {
  label: string; // Header or label of the field
  key: T; // unique identifier
  description?: string; //additional information or help
  type: FieldType; // 'Text' | 'Number' | 'Select' | 'Boolean';
  // alternateMatches?: string[]; // used to auto-match fields
  // validations?: Validation[]; // set of validations
  options?: SelectFieldOption[]; // select field options
  required?: boolean; // is the field required
  regex?: boolean;
  unique?: boolean;
  category?: string; // group that a field belongs to
};

export type Validation =
  | RequiredValidation
  | UniqueValidation
  | RegexValidation;

export type RequiredValidation = {
  rule: 'required';
  errorMessage: string;
  errorLevel: ErrorLevel;
};

export type UniqueValidation = {
  rule: 'unique';
  errorMessage: string;
  errorLevel: ErrorLevel;
};

export type RegexValidation = {
  rule: 'regex';
  value: string;
  flags?: string;
  errorMessage: string;
  level?: ErrorLevel;
};

export type ErrorLevel = 'info' | 'warning' | 'error';

export enum DataTypes {
  Integer = 'Integer',
  Float = 'Float',
  Text = 'Text',
  Date = 'Date',
}

export enum ImportStepType {
  PreImport = 'Preparation',
  Upload = 'Upload',
  // SelectSheet = 'Select Sheet',
  SelectHeader = 'Select Header',
  MatchColumns = 'Match Columns',
  ValidateData = 'Validate Data',
  MetaData = 'Metadata',
}

export enum ImportStepIndex {
  PreImport = 0,
  Upload = 1,
  // SelectSheet = 1,
  SelectHeader = 2,
  MatchColumns = 3,
  ValidateData = 4,
  MetaData = 5,
}

export interface ColumnMap {
  source: string;
  target?: string;
}

export interface importColumn {
  name: string;
  title: string;
  type: string;
  required: boolean;
}

export interface ImportStepProps {
  state: ImportWizardState;
  onContinue: (state: ImportWizardState) => Promise<void>;
  onBack?: () => void;
  onSkip?: () => void;
}

export type ImportWizardState = {
  dataType: string;
  stepIndex: number;
  activeStep: StepType;
  rawDataFile: File | null;
  validatedDataFile: File | null;
  // targetFields: Fields<any>;
  rawRecords: any[];
  rawColumns: string[];
  transformedData: any[];
  selectedWorksheetName: string | undefined;
  headers: string[];
  workbook?: XLSX.WorkBook;
  columnMap: ColumnMap[];
  fileName: string | undefined;
  loading: boolean;
  templateList: string[];
  metadata?: MetadataValues;
  preImportValues?: PreImportValues;
};

export interface MetadataValues {
  [key: string]: any;
}

export interface PreImportValues {
  // [key: string]: any;
  dataType: string;
  hasAgreedTerms: boolean;
}

export interface SourceToTargetKeyMap {
  oldKey: string;
  newKey: string;
}

export interface ReactDataGridColDef {
  key: string;
  name: string;
  width?: number;
  resizable: boolean;
  frozen?: boolean;
  renderCell?: (props: RenderCellProps<any, any>) => void;
}

export const ERROR_COLUMN_NAME = '_errors';
export const ID_COLUMN_NAME = 'idx';

export const initialWizardState: ImportWizardState = {
  dataType: 'Occurrence',
  stepIndex: ImportStepIndex.Upload,
  activeStep: StepType.upload,
  rawDataFile: null,
  validatedDataFile: null,
  // targetFields: [],
  rawRecords: [],
  rawColumns: [],
  transformedData: [],
  selectedWorksheetName: undefined,
  headers: [],
  workbook: undefined,
  columnMap: [],
  fileName: undefined,
  loading: false,
  templateList: [],
  metadata: {},
};

export const DatasetType = {
  Occurrence: 'Occurrence',
  OccurrenceBionomics: 'Occurrence & Bionomics',
  OccurrenceIR: 'Occurrence & Insecticide Resistance',
  Complete: 'Occurrence, Bionomics & Insecticide Resistance',
};
