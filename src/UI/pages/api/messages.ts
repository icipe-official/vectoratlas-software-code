import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';

import {
  LANGUAGE_CODE,
  SUPPORTED_LANGUAGES,
  TranslationMessage,
} from '../../utils/localization';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Any file inside the folder pages/api is mapped to /api/* and will be treated as an API endpoint instead of a page
 * See https://freedium.cfd/https://javascript.plainenglish.io/read-and-write-local-json-data-with-next-js-efd2dcec18c7
 * @param req
 * @param res
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // If its a GET, load messages file
  if (req.method === 'GET') {
    const { locale } = req.query;
    const objectData = loadMessages(locale as LANGUAGE_CODE);
    const messagesFilePath = getFilePath(locale as LANGUAGE_CODE);
    // res.status(200).json(objectData);
    res.status(200).json({ data: objectData, fp: messagesFilePath });
  } else if (req.method === 'POST') {
    const { parent, messages } = req.body;

    // loop through and save
    SUPPORTED_LANGUAGES.map((el) => {
      // load existing messages
      const existingMessages = loadMessages(el.code);

      //load again else comparison will not work as expected
      //@TODO, find a non-breaking means to copy the loaded data and avoid multiple loading
      const oldMessages = loadMessages(el.code);

      // modify existing messages
      const finalMessages = modifyMessages(
        existingMessages,
        messages,
        parent,
        el.code,
      );

      // save to file only if there is a change
      if (!_.isEqual(oldMessages, finalMessages)) {
        writeMessages(finalMessages, el.code);
      }
    });
    // Send a success response
    res.status(200).json({
      message: 'Data stored successfully',
    });
  }
}

const getFilePath = (locale: LANGUAGE_CODE) => {
  locale = locale || 'en';
  let cwd = process.cwd();
  // if (isProduction) {
  //   cwd = cwd + '/.next/standalone';
  // }
  console.log('CWD: ', cwd);
  const messagesFilePath = path.join(cwd, `public/messages/${locale}.json`);
  return messagesFilePath;
};

const loadMessages = (locale: LANGUAGE_CODE) => {
  const filePath = getFilePath(locale);
  const jsonData = fs.readFileSync(filePath);
  //@ts-ignore
  const data = JSON.parse(jsonData);
  return data;
};

const writeMessages = (messages: object, locale: LANGUAGE_CODE) => {
  // Convert the object back to a JSON string
  const updatedData = JSON.stringify(messages, null, 2);
  // Write the updated data to the JSON file
  const filePath = getFilePath(locale);
  fs.writeFileSync(filePath, updatedData);
};

const modifyMessages = (
  exisingData: object,
  newData: TranslationMessage[],
  parent: string,
  locale: LANGUAGE_CODE,
) => {
  // For each row, update the value for the different locale
  const tempData = { ...exisingData }; // make a copy
  newData.forEach((el) => {
    _.set(tempData, el.path, el[locale]);
  });
  return tempData;
};
