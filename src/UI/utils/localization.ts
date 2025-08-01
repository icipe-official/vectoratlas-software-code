import { GetServerSidePropsContext } from 'next';
import { createTranslator } from 'next-intl';
import { localizationSlice } from '../state/localization/localizationSlice';
import store, { AppState } from '../state/store';
import { stat, writeFileSync } from 'fs';

export type LANGUAGE_CODE = 'en' | 'fr' | 'pt';
type LANGUAGE = {
  name: string;
  code: LANGUAGE_CODE;
  emoji: string;
};

export const SUPPORTED_LANGUAGES: LANGUAGE[] = [
  { name: 'English', code: 'en', emoji: '🇬🇧' },
  { name: 'Francais', code: 'fr', emoji: '🇫🇷' },
  { name: 'Portuguese', code: 'pt', emoji: '🇵🇹' },
];

export type TranslationMessage = {
  id: string;
  path: string;
  label: string;
  en: string;
  fr: string;
  pt: string;
};

export const getMessages = async (context: GetServerSidePropsContext) => {
  const locale = context.locale || 'en';
  const cookies = context.req.cookies;
  // get saved locale or if not, return default
  const cookieLocale = (await cookies['VECTORATLAS_LOCALE']) || 'en';
  return {
    props: {
      messages: (await import(`../messages/${cookieLocale}.json`)).default,
      // Note that when `now` is passed to the app, you need to make sure the
      // value is updated from time to time, so relative times are updated. See
      // https://next-intl-docs.vercel.app/docs/usage/configuration#global-now-value
      now: new Date().getTime(),
    },
  };
};

export const getTranslation = async (key: string, values: any = null) => {
  // let messages = {};
  // this should be up to you, maybe from app state or from cookies
  // const locale = locale() ?? 'en';
  const locale = (store.getState() as AppState).localization.locale || 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;
  // messages =
  //   Object.keys(messages).length == 0
  //       (await import(`../messages/${locale}.json`)).default
  //     : messages;
  const t = createTranslator({ locale, messages });
  return t(key, values);
};

/**
 * Get translation label with variables unreplaced
 * @param key
 * @param values
 * @param locale
 * @returns
 */
export const getRawTranslation = async (
  key: string,
  language: LANGUAGE_CODE = 'en'
) => {
  // this should be up to you, maybe from app state or from cookies
  let locale = (store.getState() as AppState).localization.locale || 'en';
  if (language) {
    locale = language;
  }
  const messages = (await import(`../messages/${locale}.json`)).default;
  console.log('Messages: ', messages);
  // messages =
  //   Object.keys(messages).length == 0
  //       (await import(`../messages/${locale}.json`)).default
  //     : messages;
  const t = createTranslator({ locale, messages });
  return t(key);
};

// /**
//  * Save translations to file
//  * @param messagesJson
//  * @param language
//  */
// export const saveTranslations = (messagesJson: object, language: string) => {
//   writeFileSync(
//     `../messages/${language}1.json`,
//     JSON.stringify(messagesJson, null, 2),
//     'utf8'
//   );
// };
