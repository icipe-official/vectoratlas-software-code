import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { referenceQuery } from '../../../api/queries';

export const getSourceById = createAsyncThunk(
  'source/getSourceById',
  async (num_id: number) => {
    const result = await fetchGraphQlData(
      referenceQuery(0, 1, 'num_id', 'ASC', num_id, num_id, '')
    );
    const items = result.data.allReferenceData.items;
    return items.length > 0 ? items[0] : null;
  }
);
