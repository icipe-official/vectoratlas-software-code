import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceCsvFilterQuery } from '../../../api/queries';
import { convertToCSV } from '../../../utils/utils';
import { MapState } from '../mapSlice';
import { toast } from 'react-toastify';

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
    doi_creator_name,
    doi_creator_email,
  }: {
    filters: MapState['filters'];
    doi_creator_name?: string;
    doi_creator_email?: string;
  }) => {
    const numberOfItemsPerResponse = 500;
    let skip = 0;
    let allData: Record<string, any>[] = [];

    const downloadStatus = toast.loading('Downloading: 0%');

    try {
      // Load definitions as CSV
      const definitionsCSV: string | null = await loadDefinitionsCSV();

      // Fetch first batch with DOI requester info
      let filteredData;

      if (doi_creator_name || doi_creator_email) {
        // First request: Include DOI creator fields if they exist
        filteredData = await fetchGraphQlData(
          occurrenceCsvFilterQuery(
            skip,
            numberOfItemsPerResponse,
            filters,
            doi_creator_name,
            doi_creator_email
          )
        );
      } else {
        // First request: No DOI creator fields
        filteredData = await fetchGraphQlData(
          occurrenceCsvFilterQuery(skip, numberOfItemsPerResponse, filters)
        );
      }

      if (!filteredData?.data?.OccurrenceCsvData) {
        throw new Error('Invalid API response: OccurrenceCsvData is missing.');
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
            'Invalid API response: OccurrenceCsvData is missing.'
          );
        }

        allData = allData.concat(filteredData.data.OccurrenceCsvData.items);

        toast.update(downloadStatus, {
          render: `Downloading: ${Math.round(
            (allData.length * 100) / filteredData.data.OccurrenceCsvData.total
          )}%`,
        });
      }

      // Convert filtered data to CSV
      const filteredCSV = convertToCSV(headers, allData);

      // Create ZIP archive
      const zip = new JSZip();
      zip.file('filteredVAData.csv', filteredCSV);
      if (definitionsCSV) {
        zip.file('Definitions.csv', definitionsCSV);
      }

      // Generate ZIP file and trigger download
      zip.generateAsync({ type: 'blob' }).then((content) => {
        FileSaver.saveAs(content, 'filteredData.zip');

        toast.update(downloadStatus, {
          render: 'Download Complete',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
      });
    } catch (e: any) {
      toast.update(downloadStatus, {
        render: `Download Failed: ${e.message} - Contact vectoratlas@icipe.org`,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  }
);

;
