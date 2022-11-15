import { render } from '../../test_config/render';
import { screen, fireEvent } from '@testing-library/dom';
import { Source, initialState } from '../../state/sourceSlice';
import { AppState } from '../../state/store';
import SourceTable from './source_table';

describe('SourceTable', () => {
  const sourceList: Source[] = [
    {
      article_title: 'Title1',
      author: 'Author 1',
      num_id: 1,
      journal_title: 'Journal 1',
      v_data: true,
      published: false,
      citation: 'Title1',
      year: 1990,
      report_type: 'Report',
    },
    {
      article_title: 'Title2',
      author: 'Author 2',
      num_id: 2,
      journal_title: 'Journal 1',
      v_data: true,
      published: false,
      citation: 'Title1',
      year: 1990,
      report_type: 'Report',
    },
  ];

  const state: Partial<AppState> = {
    source: {
      ...initialState,
      source_info: { items: sourceList, total: 30 },
      source_table_options: {
        page: 0,
        rowsPerPage: 10,
        orderBy: 'num_id',
        order: 'asc',
      },
    },
  };

  it('renders all rows', () => {
    render(<SourceTable />, state);
    expect(screen.getByTestId('row 1')).toBeInTheDocument();
    expect(screen.getByTestId('row 2')).toBeInTheDocument();
  });

  it('calls action on next page click', async () => {
    const { store } = render(<SourceTable />, state);
    fireEvent.click(
      await screen.findByRole('button', { name: 'Go to next page' })
    );

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: 1,
      type: 'source_info/changeSourcePage',
    });
  });

  it('calls action on previous page click', async () => {
    const newState: Partial<AppState> = {
      source: {
        ...initialState,
        source_info: { items: sourceList, total: 30 },
        source_table_options: {
          page: 1,
          rowsPerPage: 10,
          orderBy: 'num_id',
          order: 'asc',
        },
      },
    };
    const { store } = render(<SourceTable />, newState);
    fireEvent.click(
      await screen.findByRole('button', { name: 'Go to previous page' })
    );

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: 0,
      type: 'source_info/changeSourcePage',
    });
  });

  it('calls action on sort column click', async () => {
    const newState: Partial<AppState> = {
      source: {
        ...initialState,
        source_info: { items: sourceList, total: 30 },
        source_table_options: {
          page: 1,
          rowsPerPage: 10,
          orderBy: 'num_id',
          order: 'asc',
        },
      },
    };
    const { store } = render(<SourceTable />, newState);
    fireEvent.click(
      await screen.findByTestId('sort-author')
    );

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: 'author',
      type: 'source_info/changeSort',
    });
  });
});
