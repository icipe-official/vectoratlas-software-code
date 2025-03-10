import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceCsvFilterQuery } from '../../../api/queries';
import { MapState } from '../mapSlice';
import { toast } from 'react-toastify';

// Function to load the entire Definitions.xlsx file
const loadDefinitionsSheet = async () => {
  try {
    const response = await fetch('/Definitions.xlsx'); // Adjust path if needed
    if (!response.ok) throw new Error('Failed to load definitions file');

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    return workbook; // Return the full workbook object
  } catch (error) {
    console.error('Error loading definitions file:', error);
    return null; // Return null if loading fails
  }
};

export const getFilteredData = createAsyncThunk(
  'export/getFilteredData',
  async (filters: MapState['filters']) => {
    const numberOfItemsPerResponse = 500;
    let skip = 0;
    let allData: any[] = [];

    const downloadStatus = toast.loading('Downloading: 0%', { progress: undefined });

    try {
      // Load the definitions Excel file
      const definitionsWorkbook = await loadDefinitionsSheet();
      
      // Fetch filtered data
      let filteredData = await fetchGraphQlData(
        occurrenceCsvFilterQuery(skip, numberOfItemsPerResponse, filters)
      );

      if (!filteredData?.data?.OccurrenceCsvData) {
        throw new Error('Invalid API response: OccurrenceCsvData is missing.');
      }

      const headers = filteredData.data.OccurrenceCsvData.items[0];
      allData = filteredData.data.OccurrenceCsvData.items.slice(1);

      while (filteredData.data.OccurrenceCsvData.hasMore) {
        skip += numberOfItemsPerResponse;
        filteredData = await fetchGraphQlData(
          occurrenceCsvFilterQuery(skip, numberOfItemsPerResponse, filters)
        );

        if (!filteredData?.data?.OccurrenceCsvData) {
          throw new Error('Invalid API response: OccurrenceCsvData is missing.');
        }

        allData = allData.concat(filteredData.data.OccurrenceCsvData.items.slice(1));

        toast.update(downloadStatus, {
          render: `Downloading: ${Math.round(
            (allData.length * 100) / filteredData.data.OccurrenceCsvData.total
          )}%`,
        });
      }

      // Convert filtered data into an array format for Excel
      const dataArray = [Object.keys(headers), ...allData.map((row) => Object.values(row))];

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      const worksheet1 = XLSX.utils.aoa_to_sheet(dataArray);

      XLSX.utils.book_append_sheet(workbook, worksheet1, 'Filtered Data');

      // Append the definitions sheet if loaded successfully
      if (definitionsWorkbook) {
        const sheetName = definitionsWorkbook.SheetNames[0]; // Assuming first sheet is the relevant one
        const definitionsSheet = definitionsWorkbook.Sheets[sheetName];
        XLSX.utils.book_append_sheet(workbook, definitionsSheet, 'Definitions');
      }

      // Generate Excel file and trigger download
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      FileSaver.saveAs(file, 'filteredVAData.xlsx');

      toast.update(downloadStatus, {
        render: 'Download Complete',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
      });
    } catch (e: any) {
      toast.update(downloadStatus, {
        render: `Download Failed: ${e.message} - Contact vectoratlas@icipe.org`,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
      });
    }
  }
);
