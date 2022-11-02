import mockStore from '../test_config/mockStore';
import reducer, {getSourceInfo, initialState} from './sourceSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';

const mockApi = api as {
    fetchGraphQlData: (query: string) => Promise<any>;
};

jest.mock('../api/queries', () => ({
    referenceQuery: jest.fn().mockReturnValue('test sources query'),
  }));

  jest.mock('../api/api', () => ({
    __esModule: true,
    fetchGraphQlData: jest
    .fn()
    .mockResolvedValue([{
            author: 'testAuthor', 
            article_title: 'testArticleTitle',
            journal_title: 'testJournalTitle',
            citation: 'testCitation',
            year: 0,
            published: true,
            report_type:'testReportType',
            v_data: true, 
        }]),
  })); 
  it('returns initial state when given undefined previous state', () => {
    expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
  });

  describe('getSourceInfo', () => {
    const pending = {type: getSourceInfo.pending.type};
    const fulfilled = {
        type: getSourceInfo.fulfilled.type,
        payload: [
            {
                author: 'testAuthor', 
                article_title: 'testArticleTitle',
                journal_title: 'testJournalTitle',
                citation: 'testCitation',
                year: 0,
                published: true,
                report_type:'testReportType',
                v_data: true,
            },
        ],
    };
    const rejected = {type: getSourceInfo.rejected.type};
    const {store} = mockStore({source: initialState});

    afterEach(() => {
        store.clearActions();
        jest.restoreAllMocks();
    });

    it('calls fetchGraphQL', async () => {
        store.dispatch(getSourceInfo());

        expect(api.fetchGraphQlData).toBeCalled;
    });

    it('returns the fetched data', async() =>{
        store.dispatch(getSourceInfo());

        const actions = store.getActions();
        await waitFor(() => expect(actions).toHaveLength(2));
        expect(actions[0].type).toEqual(pending.type);
        expect(actions[1].type).toEqual(fulfilled.type);
        store;

    });

    it('dispatches rejected action on bad request', async() => {
        mockApi.fetchGraphQlData = jest
        .fn()
        .mockRejectedValue({status: 400, data: 'Bad request'});
        store.dispatch(getSourceInfo());

        const actions = store.getActions();
        await waitFor(() => expect(actions).toHaveLength(2));
        expect(actions[1].type).toEqual(rejected.type);

    });

    it('pending action changes state', () => {
        const newState = reducer(initialState, pending);
        expect(newState.source_info).toEqual([]);
        expect(newState.source_info_status).toEqual('loading');
    });

    it('fulfilled action changes state', () => {
        const newState = reducer(initialState, fulfilled);
        expect(newState.source_info).toEqual([{
                author: 'testAuthor', 
                article_title: 'testArticleTitle',
                journal_title: 'testJournalTitle',
                citation: 'testCitation',
                year: 0,
                published: true,
                report_type:'testReportType',
                v_data: true,
            },
        ]);
        expect(newState.source_info_status).toEqual('success');
    });

    it('rejected action state changes state', () => {
        const newState = reducer(initialState, rejected);
        expect(newState.source_info).toEqual([]);
        expect(newState.source_info_status).toEqual('error');

    });
  });

