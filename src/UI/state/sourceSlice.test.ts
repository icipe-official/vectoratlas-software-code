import mockStore from '../test_config/mockStore';
import reducer, { getSourceInfo, initialState, changeSourcePage, changeSourceRowsPerPage, postNewSource, Source } from './sourceSlice';
import { initialState as initialAuthState } from './authSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';
import { toast } from "react-toastify";

const mockApi = api as {
  fetchGraphQlData: (query: string) => Promise<any>;
  fetchGraphQlDataAuthenticated: (query: string, token: any) => Promise<any>;
};

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
jest.mock('../api/queries', () => ({
  referenceQuery: jest.fn().mockReturnValue('test sources query'),
  newSourceQuery: jest.fn().mockReturnValue('test new source query'),
}));

jest.mock('../api/api', () => ({
  __esModule: true,
  fetchGraphQlData: jest.fn().mockResolvedValue({
    data: {
      allReferenceData: [
        {
          author: 'testAuthor',
          article_title: 'testArticleTitle',
          journal_title: 'testJournalTitle',
          citation: 'testCitation',
          year: 0,
          published: true,
          report_type: 'testReportType',
          v_data: true,
        },
      ],
    },
  }),
  fetchGraphQlDataAuthenticated: jest.fn()
}));
it('returns initial state when given undefined previous state', () => {
  expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
});

describe('getSourceInfo', () => {
  const pending = { type: getSourceInfo.pending.type };
  const fulfilled = {
    type: getSourceInfo.fulfilled.type,
    payload: {
      items: [
        {
          author: 'testAuthor',
          article_title: 'testArticleTitle',
          journal_title: 'testJournalTitle',
          citation: 'testCitation',
          year: 0,
          published: true,
          report_type: 'testReportType',
          v_data: true,
        },
      ],
      total: 10,
    },
  };
  const rejected = { type: getSourceInfo.rejected.type };
  const { store } = mockStore({ source: initialState });

  afterEach(() => {
    store.clearActions();
    jest.restoreAllMocks();
  });

  it('calls fetchGraphQL', async () => {
    store.dispatch(getSourceInfo());

    expect(api.fetchGraphQlData).toBeCalled;
  });

  it('returns the fetched data', async () => {
    store.dispatch(getSourceInfo());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[0].type).toEqual(pending.type);
    expect(actions[1].type).toEqual(fulfilled.type);
    store;
  });

  it('dispatches rejected action on bad request', async () => {
    mockApi.fetchGraphQlData = jest
      .fn()
      .mockRejectedValue({ status: 400, data: 'Bad request' });
    store.dispatch(getSourceInfo());

    const actions = store.getActions();
    await waitFor(() => expect(actions).toHaveLength(2));
    expect(actions[1].type).toEqual(rejected.type);
  });

  it('pending action changes state', () => {
    const newState = reducer(initialState, pending);
    expect(newState.source_info).toEqual({ items: [], total: 0 });
    expect(newState.source_info_status).toEqual('loading');
  });

  it('fulfilled action changes state', () => {
    const newState = reducer(initialState, fulfilled);
    expect(newState.source_info).toEqual({
      items: [
        {
          author: 'testAuthor',
          article_title: 'testArticleTitle',
          journal_title: 'testJournalTitle',
          citation: 'testCitation',
          year: 0,
          published: true,
          report_type: 'testReportType',
          v_data: true,
        },
      ],
      total: 10,
    });
    expect(newState.source_info_status).toEqual('success');
  });

  it('rejected action state changes state', () => {
    const newState = reducer(initialState, rejected);
    expect(newState.source_info).toEqual({ items: [], total: 0 });
    expect(newState.source_info_status).toEqual('error');
  });
});

describe('other actions', () => {
  it('changeSourcePage changes the page', () => {
    const action = changeSourcePage(3);
    const newState = reducer(initialState, action);
    expect(newState.source_table_options.page).toEqual(3);
  });

  it('changeSourceRowsPerPage changes the rowsPerPage', () => {
    const action = changeSourceRowsPerPage(100);
    const newState = reducer(initialState, action);
    expect(newState.source_table_options.rowsPerPage).toEqual(100);
  });
})

describe('postNewSource', () => {
  const { store } = mockStore({ source: initialState, auth: {...initialAuthState, token: '123'} });
  const newSource: Source = {
    author: 'Test 1',
    article_title: 'Title 1',
    journal_title: 'Journal 1',
    report_type: 'Type 1',
    year: 1990,
    v_data: true,
    published: true,
    citation: 'Title 1',
    num_id: 1
   };

  it('calls fetchGraphQlDataAuthenticated', async () => {
    store.dispatch(postNewSource(newSource));

    expect(api.fetchGraphQlDataAuthenticated).toBeCalledWith('test new source query', '123');
  });

  it('toasts error on duplicate failure', () => {
    mockApi.fetchGraphQlDataAuthenticated = jest.fn().mockResolvedValue({
      errors: [
        {message: 'duplicate key value found'}
      ]
    });

    store.dispatch(postNewSource(newSource));
    waitFor(() => {
      expect(toast.error).toBeCalledWith(`Reference with title "${newSource.article_title}" already exists`)
    });
  });

  it('toasts error on other failure', () => {
    mockApi.fetchGraphQlDataAuthenticated = jest.fn().mockResolvedValue({
      errors: [
        {message: 'other error'}
      ]
    });

    store.dispatch(postNewSource(newSource));
    waitFor(() => {
      expect(toast.error).toBeCalledWith(`Unknown error in creating new reference. Please try again.`)
    });
  });

  it('toasts success on success', () => {
    mockApi.fetchGraphQlDataAuthenticated = jest.fn().mockResolvedValue({
      data: { createReference: { num_id: 2 } }
    });

    store.dispatch(postNewSource(newSource));
    waitFor(() => {
      expect(toast.success).toBeCalledWith(`Reference created with id 2`)
    });
  });
});
