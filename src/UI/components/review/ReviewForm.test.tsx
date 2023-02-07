import { AppState } from '../../state/store';
import { fireEvent, render } from '../../test_config/render';
import ReviewForm from './ReviewForm';

jest.mock('../../state/review/actions/getDatasetMetadata', () => ({
  getDatasetMetadata: jest.fn().mockReturnValue({
    type: 'getDatasetMetadata',
    payload: 'id123',
  }),
}));

jest.mock('../../state/review/actions/downloadData', () => ({
  downloadDatasetData: jest.fn().mockReturnValue({
    type: 'downloadDatasetData',
    payload: 'id456',
  }),
}));

jest.mock('../../state/review/actions/approveDataset', () => ({
  approveDataset: jest.fn().mockReturnValue({
    type: 'approveDataset',
    payload: 'id456',
  }),
}));

describe('ReviewForm', () => {
  it('dispatches load metadata action on load', () => {
    const { store } = render(<ReviewForm datasetId="id123" />);
    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual({
      type: 'getDatasetMetadata',
      payload: 'id123',
    });
  });

  it('contains metadata for the dataset', () => {
    const state: Partial<AppState> = {
      review: {
        datasetMetadata: {
          UpdatedAt: '2023-02-02T10:35:50.061Z',
          UpdatedBy: 'user123',
          status: 'In review',
        },
      },
    };
    const { wrapper } = render(<ReviewForm datasetId="id123" />, state);
    expect(
      wrapper.getByText('Uploaded by user123 on 2/2/2023, 10:35:50 AM.')
    ).toBeInTheDocument();
    expect(wrapper.getByText('Status: In review')).toBeInTheDocument();
    expect(
      wrapper.getByText(
        "Two approvals are needed to change the status to 'Approved'"
      )
    ).toBeInTheDocument();
  });

  it('does not contain review form for approved data', () => {
    const state: Partial<AppState> = {
      review: {
        datasetMetadata: {
          UpdatedAt: '2023-02-02T10:35:50.061Z',
          UpdatedBy: 'user123',
          status: 'Approved',
        },
      },
    };
    const { wrapper } = render(<ReviewForm datasetId="id123" />, state);
    expect(wrapper.queryByTestId('approveButton')).not.toBeInTheDocument();
  });

  it('downloads csv data on click', () => {
    const state: Partial<AppState> = {
      review: { datasetMetadata: { UpdatedAt: 'now', UpdatedBy: 'user123' } },
    };
    const { wrapper, store } = render(<ReviewForm datasetId="id123" />, state);
    fireEvent.click(wrapper.getByTestId('dataDownload'));
    expect(store.getActions()).toHaveLength(2);
    expect(store.getActions()[1]).toEqual({
      type: 'downloadDatasetData',
      payload: 'id456',
    });
  });

  it('approves data on click', () => {
    const state: Partial<AppState> = {
      review: { datasetMetadata: { UpdatedAt: 'now', UpdatedBy: 'user123' } },
    };
    const { wrapper, store } = render(<ReviewForm datasetId="id123" />, state);
    fireEvent.click(wrapper.getByTestId('approveButton'));
    expect(store.getActions()).toHaveLength(2);
    expect(store.getActions()[1]).toEqual({
      type: 'approveDataset',
      payload: 'id456',
    });
  });

  it('shows message when no dataset id passed', () => {
    const state: Partial<AppState> = {
      review: { datasetMetadata: { UpdatedAt: 'now', UpdatedBy: 'user123' } },
    };
    const { wrapper, store } = render(<ReviewForm />, state);
    expect(
      wrapper.getByText(
        "Please include a valid dataset_id in the url - i.e. 'http://vectoratlas.icipe.org/review",
        {
          exact: false,
        }
      )
    ).toBeInTheDocument();
    expect(store.getActions()).toHaveLength(0);
  });

  it('shows message when no dataset id passed', () => {
    const state: Partial<AppState> = {
      review: { datasetMetadata: { UpdatedAt: '', UpdatedBy: '', status: '' } },
    };
    const { wrapper, store } = render(<ReviewForm datasetId="id123" />, state);
    expect(
      wrapper.getByText('Please check the id and try again.', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(store.getActions()).toHaveLength(1);
  });
});
