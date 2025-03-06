import React from 'react';
import {
  ColumnMap,
  Fields,
  ImportStepIndex,
  ImportStepType,
  ImportWizardState,
} from './types';
import { UploadStep } from './steps/UploadStep/UploadStep';
import { SelectHeader } from './steps/SelectHeaderStep/components/SelectHeader';
import { SelectHeaderStep } from './steps/SelectHeaderStep/components/SelectHeaderStep';
import { MatchColumnsStep } from './steps/MatchColumnsStep/MatchColumnsStep';
import { ValidateDataStep } from './steps/ValidateDataStep/ValidateDataStep';
// import { SaveDataStep } from './steps/SaveDataStep/SaveDataStep';
import { useSpreadsheetImporter } from './hooks/useSpreadsheetImporter';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { MetadataStep } from './steps/MetadataStep/MetadataStep';
import { PreImportStep } from './steps/PreImportStep/PreImportStep';
import { TextField } from '@mui/material';

interface Props {
  state: ImportWizardState;
  onNext: (v: ImportWizardState) => void;
  onPrev: (v: ImportWizardState) => void;
  onSkip: (v: ImportWizardState) => void;
  updateState: (v: ImportWizardState) => void;
}

export const ImportProcessFlow = ({
  state,
  onNext,
  onPrev,
  onSkip,
  updateState,
}: Props) => {
  const {
    targetFields,
    maxRecords,
    preImportStepHook,
    uploadStepSkipPostUploadStepsHook,
    uploadStepHook,
    selectHeaderStepHook,
    matchColumnsStepHook,
    validateDataStepHook,
    metadataStepHook,
    onFinish,
    extraSteps,
    metadataFields,
    preImportComponent,
    autoMapHeaders,
    autoMapDistance,
  } = useSpreadsheetImporter();

  switch (state.stepIndex) {
    case ImportStepIndex.PreImport:
      return (
        <PreImportStep
          state={state}
          onContinue={async (state) => {
            console.log('Continuing from pre-import step ');
            try {
              if (preImportStepHook) await preImportStepHook(state);
              onNext(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onSkip={async () => {
            onSkip(state);
          }}
        >
          {preImportComponent}
        </PreImportStep>
      );
      break;
    case ImportStepIndex.Upload:
      return (
        <UploadStep
          state={state}
          onFileAccepted={async (state) => {
            updateState(state);
          }}
          onSelectWorksheet={async (state) => {
            updateState(state);
          }}
          onContinue={async (state) => {
            console.log('Continuing from step 1 ');
            const isSingleSheet = state.workbook?.SheetNames.length === 1;
            // @TODO check if max records have been exceeded
            // if (
            //   maxRecords &&
            //   exceedsMaxRecords(
            //     workbook.Sheets[workbook.SheetNames[0]],
            //     maxRecords
            //   )
            // ) {
            //   errorToast(
            //     translations.uploadStep.maxRecordsExceeded(
            //       maxRecords.toString()
            //     )
            //   );
            //   return;
            // }
            try {
              if (uploadStepHook) {
                await uploadStepHook(state);
              }
              onNext(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          // onBack={async () => {
          //   try {
          //     onPrev(state);
          //   } catch (e) {
          //     toast.error((e as Error).message);
          //   }
          // }}
          onSkip={async () => {
            try {
              if (onSkip) onSkip(state);
              onNext(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onSkipPostUploadSteps={async (state) => {
            try {
              if (uploadStepSkipPostUploadStepsHook) {
                await uploadStepSkipPostUploadStepsHook(state);
              }
              await onFinish(state, true);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        />
      );
      break;
    case ImportStepIndex.SelectHeader:
      return (
        <SelectHeaderStep
          state={state}
          onContinue={async (state) => {
            console.log('Continuing from select header step');
            try {
              if (selectHeaderStepHook) await selectHeaderStepHook(state);
              onNext(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onBack={async () => {
            try {
              onPrev(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onSkip={async () => {
            try {
              if (onSkip) onSkip(state);
              onNext(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        />
      );
      break;
    case ImportStepIndex.MatchColumns:
      return (
        <MatchColumnsStep
          state={state}
          onContinue={async (state) => {
            console.log('Continuing from match column step');
            try {
              if (matchColumnsStepHook) await matchColumnsStepHook(state);
              onNext(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onBack={async () => {
            try {
              onPrev(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onSkip={async () => {
            try {
              if (onSkip) onSkip(state);
              onNext(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          autoMapDistance={autoMapDistance}
          autoMapHeaders={autoMapHeaders}
        />
      );
      break;
    case ImportStepIndex.ValidateData:
      return (
        <ValidateDataStep
          state={state}
          onContinue={async (state) => {
            console.log('Continuing from validate data step');
            try {
              if (validateDataStepHook) await validateDataStepHook(state);
              onNext(state);
              if (!metadataFields || metadataFields.length == 0) {
                // we call this here since this is the last step when we DO NOT have metafields
                if (onFinish) await onFinish(state);
              }
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onBack={async () => {
            try {
              onPrev(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onSkip={async () => {
            try {
              if (onSkip) onSkip(state);
              onNext(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        />
      );
      break;
    case ImportStepIndex.MetaData:
      return (
        <MetadataStep
          state={state}
          onContinue={async (state) => {
            try {
              if (metadataStepHook) await metadataStepHook(state);
              if (metadataFields && metadataFields.length > 0) {
                // we call this here since this is the last step when we have metafields
                if (onFinish) await onFinish(state);
              }
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onBack={async () => {
            try {
              onPrev(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          onSkip={async () => {
            try {
              if (onSkip) onSkip(state);
              onNext(state);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        />
      );
      break;
    default:
      break;
  }

  // if (state.stepIndex > ImportStepIndex.ValidateData) {

  //   const component: React.ReactNode = extraSteps[state.stepIndex].component;
  //   return React.createContext(component);

  //   return (
  //     <UploadStep
  //       state={state}
  //       onContinue={async (state) => {
  //         console.log('Continuing from step 1 ');
  //         const isSingleSheet = state.workbook?.SheetNames.length === 1;
  //         // @TODO check if max records have been exceeded
  //         // if (
  //         //   maxRecords &&
  //         //   exceedsMaxRecords(
  //         //     workbook.Sheets[workbook.SheetNames[0]],
  //         //     maxRecords
  //         //   )
  //         // ) {
  //         //   errorToast(
  //         //     translations.uploadStep.maxRecordsExceeded(
  //         //       maxRecords.toString()
  //         //     )
  //         //   );
  //         //   return;
  //         // }
  //         try {
  //           if (uploadStepHook) await uploadStepHook();
  //           onNext(state);
  //         } catch (e) {
  //           toast.error((e as Error).message);
  //         }
  //       }}
  //     />
  //   );
  // }
  return <div>Steps</div>;
};
