import * as XLSX from 'xlsx';
import lavenstein from 'js-levenshtein';
import {
  ERROR_COLUMN_NAME,
  Field,
  Fields,
  RawData,
  ReactDataGridColDef,
  SourceToTargetKeyMap,
} from './types';
// import * as fs from 'fs';

export const readExcelFile = async (excelFile: File) => {
  // Parse a file
  //   const workSheetsFromFile = xlsx.parse(`${__dirname}/sampleData.xlsx`);
  //   return workSheetsFromFile;
  const buffer = await readFileAsync(excelFile);
  const workbook = XLSX.read(buffer, {
    type: 'binary',
    cellDates: true,
    dateNF: 'yyyy-mm-dd',
    raw: true,
    dense: true,
    codepage: 65001,
  });
  console.log('Workbook: ', workbook);
  return workbook;
  //   const reader = new FileReader();
  //   reader.onload = async (e) => {

  //     // const sheetName = workbook.SheetNames[0];
  //     // const worksheet = workbook.Sheets[sheetName];
  //     // const data = XLSX.utils.sheet_to_json(worksheet);
  //     // console.log(data);
  //   };
  //   return reader.readAsArrayBuffer(excelFile); //.readAsBinaryString(excelFile);
  /*
  //    setLoading(true)
  const arrayBuffer = await readFileAsync(excelFile);
  const workbook = XLSX.read(arrayBuffer, {
    cellDates: true,
    dateNF: 'yyyy-mm-dd',
    raw: true,
    dense: true,
    codepage: 65001,
  });
  //   setLoading(false)
  */
};

// export const exportExcelToCsv = async (
//   excelFilePath: string,
//   csvFilePath: string,
//   worksheetIndex: number = 0
// ) => {
//   const worksheets = await readExcelFile(excelFilePath);
//   const worksheetData = worksheets[worksheetIndex].data;

//   let csvData: string = '';
//   worksheetData.map((row) => {
//     csvData = csvData + row.join(',') + '\n';
//   });

//   fs.writeFileSync(csvFilePath, csvData);

//   console.log('Excel file converted to CSV');
// };

export const readFileAsync = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};

export const generateExcel = (data: any[]) => {
  const workbook = XLSX.utils.book_new();
  const ws_data = data; /* [
    ['Name', 'Email'],
    ['Jane Doe', 'jane@example.com'],
  ];*/
  const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
  XLSX.writeFile(workbook, 'Contacts.xlsx');
};

export const generateExcelFromJson = (jsonData: object[]) => {
  let data = [
    { name: 'Diary', code: 'diary_code', author: 'Pagorn' },
    { name: 'Note', code: 'note_code', author: 'Pagorn' },
    { name: 'Medium', code: 'medium_code', author: 'Pagorn' },
  ];
  const workSheet = XLSX.utils.json_to_sheet(jsonData /*data*/);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
  XLSX.writeFile(workBook, './temp/sample.xlsx');
};

// export const renameObjectKeys = (
//   rawDataInJson: any[],
//   fieldDefinition: []
// ): any[] => {
//   const destArray: any[] = [];
//   rawDataInJson.map((obj) => {
//     const destObj = Object.fromEntries(
//       Object.entries(obj).map(([key, value]) => [`X-${key}`, value])
//     );
//     destArray.push(destObj);
//   });
//   return destArray;
// };

export const renameObjectKeys = (
  obj: any,
  keyMappings: SourceToTargetKeyMap[],
  keepOtherFields: boolean = true
): any => {
  const getNewKey = (oldKey: string) => {
    const match = keyMappings.filter((el) => el.oldKey === oldKey);
    return match[0].newKey;
  };

  const oldKeys = keyMappings.filter((el) => el.oldKey);
  let keyValPairs = Object.entries(obj);
  if (!keepOtherFields) {
    keyValPairs = keyValPairs.filter((el: any[]) =>
      oldKeys.map((itm) => itm.oldKey).includes(el[0])
    );
  }
  const destObj = Object.fromEntries(
    keyValPairs.map(([key, value]) => {
      const newKey = getNewKey(key);
      return [`${newKey}`, value];
    })
  );
  return destObj;
};

interface ValidationError {
  [key: string]: string[];
}

export const validateRow = (dataRow: any, columnDef: Fields<any>) => {
  if (!dataRow) {
    return dataRow;
  }
  const checkRequired = (field: Field<any>): boolean => {
    const val = dataRow[field.key];
    return val;
  };

  const errorObj: ValidationError = {};
  for (const colDef of columnDef) {
    errorObj[colDef.key] = [];
    if (colDef.required) {
      if (!checkRequired(colDef)) {
        errorObj[colDef.key].push('Value has not been set');
      }
    }

    // If the column has no errors, delete it
    if (errorObj[colDef.key].length == 0) {
      delete errorObj[colDef.key];
    }
  }
  dataRow[`${ERROR_COLUMN_NAME}`] = JSON.stringify(errorObj);
  return dataRow;
};

/**
 * Removes all special characters and replaces them with _
 * @param text
 */
export const scrub = (text: string) => {
  let res = text.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_'); // replace special characters
};
