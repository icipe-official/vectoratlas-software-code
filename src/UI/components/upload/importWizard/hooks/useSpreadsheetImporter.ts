import { useContext } from 'react';
import { ImportWizardProps } from '../types';
import { ImportWizardContext } from '../context/provider';
import { MarkRequired } from 'ts-essentials';
import { defaultImportWizardProps } from '../SpreadsheetImporter';

export const useSpreadsheetImporter = <T extends string>() =>
  //   useContext<
  //   MarkRequired<ImportWizardProps<T>, keyof typeof defaultImportWizardProps>(
  //     ImportWizardContext
  //   );
  useContext<
    MarkRequired<ImportWizardProps<T>, keyof typeof defaultImportWizardProps> //& { translations: Translations }
  >(ImportWizardContext);
