import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceCsvFilterQuery } from '../../../api/queries';
import { convertToCSV } from '../../../utils/utils';
import { MapState, singularOutputs } from '../mapSlice';
import { toast } from 'react-toastify';

export const getFilteredData = createAsyncThunk(
  'export/getFilteredData',
  async (filters: MapState['filters']) => {
    const numberOfItemsPerResponse = 5;
    let initTake = 0;
    let allData: any = [];

    const downloadStatus = toast.loading(' Downloading: 0%', {
      position: 'bottom-left',
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });

    try {
      let filteredData = await fetchGraphQlData(
        occurrenceCsvFilterQuery(
          initTake,
          numberOfItemsPerResponse,
          singularOutputs(filters)
        )
      );
      while (filteredData.data.OccurrenceCsvData.hasMore === true) {
        filteredData.data.OccurrenceCsvData.items =
          filteredData.data.OccurrenceCsvData.items.map((item: string) =>
            JSON.parse(item)
          );
        allData = allData.concat(filteredData.data.OccurrenceCsvData.items);
        initTake += numberOfItemsPerResponse;
        filteredData = await fetchGraphQlData(
          occurrenceCsvFilterQuery(
            initTake,
            numberOfItemsPerResponse,
            singularOutputs(filters)
          )
        );
        toast.update(downloadStatus, {
          render: `Downloading: ${
            // Tries to remove Math.round... for some reason
            // eslint-disable-next-line prettier/prettier
            Math.round((allData.length * 100) / filteredData.data.OccurrenceCsvData.total)
          }%`,
        });
      }
      filteredData.data.OccurrenceCsvData.items =
        filteredData.data.OccurrenceCsvData.items.map((item: string) =>
          JSON.parse(item)
        );
      allData = allData.concat(filteredData.data.OccurrenceCsvData.items);
      var file = new Blob([convertToCSV(allData)], {
        type: 'text/csv;charset=utf-8',
      });
      FileSaver.saveAs(file, 'filteredVAData.csv');
      toast.update(downloadStatus, {
        render: 'Download Complete',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (e) {
      toast.error(
        'Oops! Something went wrong - Check the console for further details'
      );
      console.log(e);
    }
  }
);
