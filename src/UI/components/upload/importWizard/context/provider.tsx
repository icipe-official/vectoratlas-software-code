import { createContext, useEffect } from 'react';
import { ImportWizardProps } from '../types';

export const ImportWizardContext = createContext({} as any);

type ProviderProps<T extends string> = {
  children: React.ReactNode;
  wizardValues: ImportWizardProps<T>;
};

export const ImportWizardProvider = <T extends string>(
  props: ProviderProps<T>
) => {
  if (!props.wizardValues.fields) {
    throw new Error('Fields must be provided to react-spreadsheet-import');
  }

  return (
    <ImportWizardContext.Provider value={props.wizardValues}>
      {props.children}
    </ImportWizardContext.Provider>
  );
};
