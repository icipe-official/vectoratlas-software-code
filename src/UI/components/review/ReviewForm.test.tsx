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
      review: { datasetMetadata: { UpdatedAt: 'now', UpdatedBy: 'user123' } },
    };
    const { wrapper } = render(<ReviewForm datasetId="id123" />, state);
    expect(
      wrapper.getByText('Data uploaded by user123 on now')
    ).toBeInTheDocument();
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
});
