import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { referenceQuery } from '../../../api/queries';
import { AppState } from '../../store';

export const getSourceInfo = createAsyncThunk(
  'source/getSourceInfo',
  async (_, { getState }) => {
    const { page, rowsPerPage, orderBy, order, startId, endId, textFilter } = (
      getState() as AppState
    ).source.source_table_options;
    const skip = page * rowsPerPage;
    const sourceInfo = await fetchGraphQlData(
      referenceQuery(
        skip,
        rowsPerPage,
        orderBy,
        order.toLocaleUpperCase(),
        startId,
        endId,
        textFilter
      )
    );
    return sourceInfo.data.allReferenceData;
  }
);
