import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchGraphQlDataAuthenticated } from '../../../api/api';
import { updateSourceQuery } from '../../../api/queries';
import { NewSource } from '../../../components/sources/source_form';
import { AppState } from '../../store';
import { getTranslation } from '../../../utils/localization';

export const updateSource = createAsyncThunk(
  'source/updateSource',
  async (source: NewSource, { getState }) => {
    const query = updateSourceQuery(source);
    const token = (getState() as AppState).auth.token;
    const result = await fetchGraphQlDataAuthenticated(query, token);
    if (result.errors) {
      toast.error(
        await getTranslation('ReduxActions.Source.errors.updateError')
        // 'Unknown error updating reference. Please try again.'
      );
      return false;
    } else if (result.data) {
      toast.success(
        await getTranslation('ReduxActions.Source.updateSuccess', {
          id: result.data.updateReference.num_id,
        })
        // `Reference ${num_id} updated successfully`
      );
      return true;
    }
  }
);
