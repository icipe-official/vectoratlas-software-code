import * as XLSX from 'xlsx';

export type ImportWizardProps<T extends string> = {
  // Field description for requested data
  fields?: Fields<T>;

  // runs after pre-import step. ImportWizardState is supplied as a parameter
  preImportStepHook?: (state: ImportWizardState) => Promise<any>;

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
};

export type InputFieldTypes = 'Text' | 'Select';

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

export type Field<T extends string> = {
  label: string; // Header or label of the field
  key: T; // unique identifier
  description?: string; //additional information or help
  type: 'Text' | 'Number' | 'Select' | 'Boolean' | 'String';
  // alternateMatches?: string[]; // used to auto-match fields
  // validations?: Validation[]; // set of validations
  options?: SelectFieldOption[]; // select field options
  required?: boolean; // is the field required
  regex?: boolean;
  unique?: boolean;
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
  target: string;
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
}

export type ImportWizardState = {
  dataType: string;
  stepIndex: number;
  rawDataFile: File | null;
  validatedDataFile: File | null;
  targetFields: Fields<any>;
  rawRecords: any[];
  rawColumns: string[];
  transformedData: any[];
  selectedWorksheetIndex: number | undefined;
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
  [key: string]: any;
}
