import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchGraphQlDataAuthenticated } from '../../../api/api';
import { deleteSourceQuery } from '../../../api/queries';
import { AppState } from '../../store';
import { getTranslation } from '../../../utils/localization';

export const deleteSource = createAsyncThunk(
  'source/deleteSource',
  async (num_id: number, { getState }) => {
    const query = deleteSourceQuery(num_id);
    const token = (getState() as AppState).auth.token;
    const result = await fetchGraphQlDataAuthenticated(query, token);

    if (result.errors) {
      
      toast.error(
        await getTranslation('ReduxActions.Source.errors.deleteError')
        // 'Unknown error in deleting reference. Please try again.'
      );
      return false;
    } else if (result.data) {
      toast.success(
        await getTranslation('ReduxActions.Source.deleteSuccess', {
          id: num_id,
        })
        // `Reference ${num_id} deleted successfully`
      );
      return true;
    }
  }
);
