import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceFilterQuery } from '../../../api/queries';
import { convertToCSV } from '../../../utils/utils';
import { MapState, singularOutputs } from '../mapSlice';

export const getFilteredData = createAsyncThunk(
  'export/getFilteredData',
  async (filters: MapState['filters']) => {
    const numberOfItemsPerResponse = 5;
    let initTake = 0;
    let allData: any = [];
    let filteredData = await fetchGraphQlData(
      occurrenceFilterQuery(
        initTake,
        numberOfItemsPerResponse,
        singularOutputs(filters)
      )
    );
    allData.push(filteredData.data.OccurrenceCsvData.items);
    while (filteredData.data.OccurrenceCsvData.hasMore === true) {
      initTake += numberOfItemsPerResponse;
      filteredData = await fetchGraphQlData(
        occurrenceFilterQuery(
          initTake,
          numberOfItemsPerResponse,
          singularOutputs(filters)
        )
      );
      allData = allData[0].concat(filteredData.data.OccurrenceCsvData.items);
    }
    allData = allData.map((item: string) => JSON.parse(item));
    var file = new Blob([convertToCSV(allData)], {
      type: 'text/csv;charset=utf-8',
    });
    FileSaver.saveAs(file, 'filteredVAData.csv');
  }
);
