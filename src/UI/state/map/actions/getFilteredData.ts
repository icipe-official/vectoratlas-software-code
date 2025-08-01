import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceCsvFilterQuery } from '../../../api/queries';
import { convertToCSV } from '../../../utils/utils';
import { MapState } from '../mapSlice';
import { toast } from 'react-toastify';
import { getTranslation } from '../../../utils/localization';

/**
 * Loads the definitions sheet and converts it into a CSV string.
 */
const loadDefinitionsCSV = async (): Promise<string | null> => {
  try {
    const response = await fetch('/Definitions.xlsx');
    if (!response.ok) throw new Error('Failed to load definitions file');

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0]; // Assuming first sheet is relevant
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_csv(worksheet); // Convert to CSV format
  } catch (error) {
    console.error('Error loading definitions file:', error);
    return null;
  }
};

export const getFilteredData = createAsyncThunk(
  'export/getFilteredData',

  async ({
    filters,
    generateDoi,
    downloaderName,
    downloaderEmail,
  }: {
    filters: MapState['filters'];
    generateDoi?: boolean;
    downloaderName?: string;
    downloaderEmail?: string;
  }) => {
    const numberOfItemsPerResponse = 500;
    let skip = 0;
    let allData: Record<string, any>[] = [];

    const downloadStatus = toast.loading('Downloading: 0%');

    try {
      // Load definitions as CSV
      const definitionsCSV: string | null = await loadDefinitionsCSV();

      // Fetch first batch with DOI requester info
      let filteredData = await fetchGraphQlData(
        occurrenceCsvFilterQuery(
          skip,
          numberOfItemsPerResponse,
          filters,
          generateDoi,
          downloaderName,
          downloaderEmail
        )
      );
      if (!filteredData?.data?.OccurrenceCsvData) {
        throw new Error(
          await getTranslation('ReduxActions.Map.errors.missingOccurrenceData')
          //'Invalid API response: OccurrenceCsvData is missing.'
        );
      }

      const headers = Object.keys(filteredData.data.OccurrenceCsvData.items[0]);
      allData = filteredData.data.OccurrenceCsvData.items;

      // Subsequent requests (omit DOI requester info)
      while (filteredData.data.OccurrenceCsvData.hasMore) {
        skip += numberOfItemsPerResponse;
        filteredData = await fetchGraphQlData(
          occurrenceCsvFilterQuery(skip, numberOfItemsPerResponse, filters) // No DOI info here
        );

        if (!filteredData?.data?.OccurrenceCsvData) {
          throw new Error(
            await getTranslation(
              'ReduxActions.Map.errors.missingOccurrenceData'
            )
            //'Invalid API response: OccurrenceCsvData is missing.'
          );
        }

        allData = allData.concat(filteredData.data.OccurrenceCsvData.items);

        const downloading = await getTranslation(
          'ReduxActions.Map.downloading'
        );

        toast.update(downloadStatus, {
          render: `${downloading}: ${Math.round(
            (allData.length * 100) / filteredData.data.OccurrenceCsvData.total
          )}%`,
        });
      }

      // Convert filtered data to CSV
      // const filteredCSV = convertToCSV(headers, allData);
      const filteredCSV = convertToCSV([], allData); // pass empty header since we already have the column headers in the allData object

      // Create ZIP archive
      const zip = new JSZip();
      zip.file('filteredVAData.csv', filteredCSV);
      if (definitionsCSV) {
        zip.file('Definitions.csv', definitionsCSV);
      }

      const downloadComplete = await getTranslation(
        'ReduxActions.Map.downloadComplete'
      );
      // Generate ZIP file and trigger download
      zip.generateAsync({ type: 'blob' }).then((content) => {
        FileSaver.saveAs(content, 'filteredData.zip');

        toast.update(downloadStatus, {
          render: downloadComplete, //'Download Complete',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
      });
    } catch (e: any) {
      const downloadFailed = await getTranslation(
        'ReduxActions.Map.downloadFailed',
        { message: e.message }
      );
      console.log(e.message);
      toast.update(downloadStatus, {
        render: downloadFailed, // `Download Failed: ${e.message} - Contact vectoratlas@icipe.org`,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  }
);
