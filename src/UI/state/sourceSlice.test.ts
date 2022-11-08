import mockStore from '../test_config/mockStore';
import reducer, {getSourceInfo, initialState, postNewSource} from './sourceSlice';
import { waitFor } from '@testing-library/react';
import * as api from '../api/api';

const mockApi = api as {
    fetchGraphQlData: (query: string) => Promise<any>;
};

jest.mock('../api/queries', () => ({
    sourceQuery: jest.fn().mockReturnValue('test sources query'),
    newSourceQuery: jest.fn().mockReturnValue('new source query'),
  }));

jest.mock('../api/api', () => ({
    __esModule: true,
    fetchGraphQlDataAuthenticated: jest.fn(),
    fetchGraphQlData: jest
    .fn()
    .mockResolvedValue({data:
    {allReferenceData:
        [{
            author: 'testAuthor',
            article_title: 'testArticleTitle',
            journal_title: 'testJournalTitle',
            citation: 'testCitation',
            year: 0,
            published: true,
            report_type:'testReportType',
            v_data: true,
        }]}}),
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

describe('postNewSource', () => {
    const {store} = mockStore({source: initialState, auth: { token: 'token123', roles: [] }});

    afterEach(() => {
        store.clearActions();
        jest.restoreAllMocks();
    });

    it('calls the fetchGraphQlDataAuthenticated method with token', () => {
        const newSource = {
            author: 'Author a',
            article_title: 'Title b',
            journal_title: 'Journal c',
            report_type: 'Report d',
            published: true,
            v_data: false,
            year: 1909
        };
        store.dispatch(postNewSource(newSource));
        expect(api.fetchGraphQlDataAuthenticated).toHaveBeenCalledWith("new source query", "token123")
    })
})
