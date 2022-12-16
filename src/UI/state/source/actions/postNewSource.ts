import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchGraphQlDataAuthenticated } from '../../../api/api';
import { newSourceQuery } from '../../../api/queries';
import { NewSource } from '../../../components/sources/source_form';
import { AppState } from '../../store';

export const postNewSource = createAsyncThunk(
  'source/getSourceInfo',
  async (source: NewSource, { getState }) => {
    const query = newSourceQuery(source);
    const token = (getState() as AppState).auth.token;
    const result = await fetchGraphQlDataAuthenticated(query, token);
    if (result.errors) {
      if (result.errors[0].message.includes('duplicate key')) {
        toast.error(
          `Reference with title "${source.article_title}" already exists`
        );
      } else {
        toast.error(
          'Unknown error in creating new reference. Please try again.'
        );
      }
      return false;
    } else if (result.data) {
      toast.success(
        `Reference created with id ${result.data.createReference.num_id}`
      );
      return true;
    }
  }
);
