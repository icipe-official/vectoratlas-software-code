import * as XLSX from 'xlsx';
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

export const exportExcelToCsv = async (
  excelFilePath: string,
  csvFilePath: string,
  worksheetIndex: number = 0
) => {
  const worksheets = await readExcelFile(excelFilePath);
  const worksheetData = worksheets[worksheetIndex].data;

  let csvData: string = '';
  worksheetData.map((row) => {
    csvData = csvData + row.join(',') + '\n';
  });

  fs.writeFileSync(csvFilePath, csvData);

  console.log('Excel file converted to CSV');
};

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
  debugger;
  XLSX.writeFile(workBook, './temp/sample.xlsx');
};
