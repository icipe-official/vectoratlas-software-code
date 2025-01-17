import type { ImportStepProps, ImportWizardProps } from './types';
import { ImportWizard } from './ImportWizard';
import { ImportWizardProvider } from './context/provider';
import { merge } from 'lodash';

// export const defaultTheme = themeOverrides;

export const defaultImportWizardProps: Partial<ImportWizardProps<any>> = {
  //autoMapHeaders: true,
  maxRecords: 5000,
  // autoMapSelectValues: false,
  // allowInvalidSubmit: true,
  // autoMapDistance: 2,
  // isNavigationEnabled: false,
  // translations: translations,
  // uploadStepHook: async (value) => value,
  // selectHeaderStepHook: async (headerValues, data) => ({ headerValues, data }),
  // matchColumnsStepHook: async (table) => table,
  // dateFormat: 'yyyy-mm-dd', // ISO 8601,
  parseRaw: true,
} as const;

export const SpreadsheetImporter = <T extends string>(
  propsWithoutDefaults: ImportWizardProps<T>
) => {
  // const props = { ...defaultProps, propsWithoutDefaults };
  const props = merge({}, defaultImportWizardProps, propsWithoutDefaults);
  // const mergedTranslations =
  //   props.translations !== translations
  //     ? merge(translations, props.translations)
  //     : translations;
  // const mergedThemes = props.rtl
  //   ? merge(defaultTheme, rtlThemeSupport, props.customTheme)
  //   : merge(defaultTheme, props.customTheme);

  return (
    <ImportWizardProvider wizardValues={{ ...props }}>
      <ImportWizard />
    </ImportWizardProvider>
  );
};
