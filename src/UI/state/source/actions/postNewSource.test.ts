import { waitFor } from '@testing-library/react';
import * as api from '../../../api/api';
import { toast } from 'react-toastify';
import mockStore from '../../../test_config/mockStore';
import reducer, { initialState, Source } from '../sourceSlice';
import { postNewSource } from './postNewSource';
import { initialState as initialAuthState } from '../../auth/authSlice';

const mockApi = api as {
  fetchGraphQlDataAuthenticated: (query: string, token: any) => Promise<any>;
};

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('../../../api/queries', () => ({
  newSourceQuery: jest.fn().mockReturnValue('test new source query'),
}));

jest.mock('../../../api/api', () => ({
  __esModule: true,
  fetchGraphQlDataAuthenticated: jest.fn(),
}));
it('returns initial state when given undefined previous state', () => {
  expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
});

describe('postNewSource', () => {
  const { store } = mockStore({
    source: initialState,
    auth: { ...initialAuthState, token: '123' },
  });
  const newSource: Source = {
    author: 'Test 1',
    article_title: 'Title 1',
    journal_title: 'Journal 1',
    report_type: 'Type 1',
    year: 1990,
    v_data: true,
    published: true,
    citation: 'Title 1',
    num_id: 1,
  };

  it('calls fetchGraphQlDataAuthenticated', async () => {
    store.dispatch(postNewSource(newSource));

    expect(api.fetchGraphQlDataAuthenticated).toBeCalledWith(
      'test new source query',
      '123'
    );
  });

  it('toasts error on duplicate failure', () => {
    mockApi.fetchGraphQlDataAuthenticated = jest.fn().mockResolvedValue({
      errors: [{ message: 'duplicate key value found' }],
    });

    store.dispatch(postNewSource(newSource));
    waitFor(() => {
      expect(toast.error).toBeCalledWith(
        `Reference with title "${newSource.article_title}" already exists`
      );
    });
  });

  it('toasts error on other failure', () => {
    mockApi.fetchGraphQlDataAuthenticated = jest.fn().mockResolvedValue({
      errors: [{ message: 'other error' }],
    });

    store.dispatch(postNewSource(newSource));
    waitFor(() => {
      expect(toast.error).toBeCalledWith(
        'Unknown error in creating new reference. Please try again.'
      );
    });
  });

  it('toasts success on success', () => {
    mockApi.fetchGraphQlDataAuthenticated = jest.fn().mockResolvedValue({
      data: { createReference: { num_id: 2 } },
    });

    store.dispatch(postNewSource(newSource));
    waitFor(() => {
      expect(toast.success).toBeCalledWith('Reference created with id 2');
    });
  });
});
