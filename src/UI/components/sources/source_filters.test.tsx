import { fireEvent, render, screen } from '../../test_config/render';
import SourceFilters from './source_filters';
import user from '@testing-library/user-event';

jest.useFakeTimers();

describe('SourceFilters', () => {
  it('includes all filter elements', () => {
    render(<SourceFilters />);
    expect(screen.getByTestId('id-filter')).toBeVisible();
    expect(screen.getByTestId('title-filter')).toBeVisible();
  });

  it('calls actions on text filter after debounce', () => {
    const { store } = render(<SourceFilters />);
    const textFilter = screen
      .getByTestId('title-filter')
      .querySelector('input');
    fireEvent.change(textFilter, { target: { value: 'filter' } });
    expect(store.getActions().length).toBe(0);

    jest.runAllTimers();
    expect(store.getActions().length).toBe(2);
    expect(store.getActions()[0]).toEqual({
      payload: 'filter',
      type: 'source_info/changeFilterText',
    });
    expect(store.getActions()[1]).toEqual(
      expect.objectContaining({ type: 'source/getSourceInfo/pending' })
    );
  });

  it('calls actions on id filter after debounce with full range', () => {
    const { store } = render(<SourceFilters />);
    const idFilter = screen.getByTestId('id-filter').querySelector('input');
    fireEvent.change(idFilter, { target: { value: '10-100' } });
    expect(store.getActions().length).toBe(0);

    jest.runAllTimers();
    expect(store.getActions().length).toBe(2);
    expect(store.getActions()[0]).toEqual({
      payload: { startId: 10, endId: 100 },
      type: 'source_info/changeFilterId',
    });
    expect(store.getActions()[1]).toEqual(
      expect.objectContaining({ type: 'source/getSourceInfo/pending' })
    );
  });

  it('calls actions on id filter after debounce with half range', () => {
    const { store } = render(<SourceFilters />);
    const idFilter = screen.getByTestId('id-filter').querySelector('input');
    fireEvent.change(idFilter, { target: { value: '-100' } });
    expect(store.getActions().length).toBe(0);

    jest.runAllTimers();
    expect(store.getActions().length).toBe(2);
    expect(store.getActions()[0]).toEqual({
      payload: { startId: null, endId: 100 },
      type: 'source_info/changeFilterId',
    });
    expect(store.getActions()[1]).toEqual(
      expect.objectContaining({ type: 'source/getSourceInfo/pending' })
    );
  });

  it('calls actions on id filter after debounce with other half range', () => {
    const { store } = render(<SourceFilters />);
    const idFilter = screen.getByTestId('id-filter').querySelector('input');
    fireEvent.change(idFilter, { target: { value: '10-' } });
    expect(store.getActions().length).toBe(0);

    jest.runAllTimers();
    expect(store.getActions().length).toBe(2);
    expect(store.getActions()[0]).toEqual({
      payload: { startId: 10, endId: null },
      type: 'source_info/changeFilterId',
    });
    expect(store.getActions()[1]).toEqual(
      expect.objectContaining({ type: 'source/getSourceInfo/pending' })
    );
  });

  it('calls actions on id filter after debounce with single id', () => {
    const { store } = render(<SourceFilters />);
    const idFilter = screen.getByTestId('id-filter').querySelector('input');
    fireEvent.change(idFilter, { target: { value: '10' } });
    expect(store.getActions().length).toBe(0);

    jest.runAllTimers();
    expect(store.getActions().length).toBe(2);
    expect(store.getActions()[0]).toEqual({
      payload: { startId: 10, endId: 10 },
      type: 'source_info/changeFilterId',
    });
    expect(store.getActions()[1]).toEqual(
      expect.objectContaining({ type: 'source/getSourceInfo/pending' })
    );
  });

  it('doesnt call actions on id filter with invalid range', () => {
    const { store } = render(<SourceFilters />);
    const idFilter = screen.getByTestId('id-filter').querySelector('input');
    fireEvent.change(idFilter, { target: { value: 'invalid' } });
    expect(store.getActions().length).toBe(0);

    jest.runAllTimers();
    expect(store.getActions().length).toBe(0);
  });
});
