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
    const numberOfItemsPerResponse = 500;
    let skip = 0;
    let allData: any = [];

    const downloadStatus = toast.loading(' Downloading: 0%', {
      progress: undefined,
    });

    try {
      let filteredData = await fetchGraphQlData(
        occurrenceCsvFilterQuery(
          skip,
          numberOfItemsPerResponse,
          singularOutputs(filters)
        )
      );
      const headers = filteredData.data.OccurrenceCsvData.items[0];

      allData = filteredData.data.OccurrenceCsvData.items.slice(1);

      while (filteredData.data.OccurrenceCsvData.hasMore) {
        skip += numberOfItemsPerResponse;
        filteredData = await fetchGraphQlData(
          occurrenceCsvFilterQuery(
            skip,
            numberOfItemsPerResponse,
            singularOutputs(filters)
          )
        );
        allData = allData.concat(
          filteredData.data.OccurrenceCsvData.items.slice(1)
        );

        toast.update(downloadStatus, {
          render: `Downloading: ${
            // eslint-disable-next-line prettier/prettier
            Math.round((allData.length * 100) / filteredData.data.OccurrenceCsvData.total)
          }%`,
        });
      }
      var file = new Blob([convertToCSV(headers, allData)], {
        type: 'text/csv;charset=utf-8',
      });

      FileSaver.saveAs(file, 'filteredVAData.csv');
      toast.update(downloadStatus, {
        render: 'Download Complete',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
      });
    } catch (e: any) {
      toast.update(downloadStatus, {
        render: `Download Failed: ${e.message} - For more details refer to the console. If this error persists, please contact vectoratlas@icipe.org`,
        type: 'error',
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
      });
      console.error(e);
    }
  }
);
