import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceCsvFilterQuery } from '../../../api/queries';
import { convertToCSV } from '../../../utils/utils';
import { MapState, singularOutputs } from '../mapSlice';

export const getFilteredData = createAsyncThunk(
  'export/getFilteredData',
  async (filters: MapState['filters']) => {
    const numberOfItemsPerResponse = 500;
    let initTake = 0;
    let allData: any = [];
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
  }
);
