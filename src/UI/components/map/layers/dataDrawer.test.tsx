import { DetailedOccurrence, initialState } from "../../../state/map/mapSlice";
import { render } from "../../../test_config/render";
import { screen, fireEvent } from '@testing-library/dom';
import DataDrawer from "./dataDrawer";
import { AppState } from "../../../state/store";

jest.mock(
  './detailedData',
  () =>
    function MockDetailedData({ data }: { data: any }) {
      return <div data-testid={data.id}>{data.id}</div>;
    }
);

describe('DataDrawer', () => {
  let state: Partial<AppState>;

  beforeEach(() => {
    const selectedData = [{ id: 123 }, { id: 456 }];

    state = { map: initialState() };
    state.map.selectedData = selectedData;
  });

  it('renders all data selected', () => {
    render(<DataDrawer />, state);

    expect(screen.getByTestId('123')).toBeVisible();
    expect(screen.getByTestId('456')).toBeVisible();
  });

  it('dispatches correct action on close', () => {
    const { store } = render(<DataDrawer />, state);
    expect(store.getActions()).toHaveLength(0);

    const close = screen.getByTestId('drawerToggle');
    fireEvent.click(close);

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual({
      payload: [],
      type: 'map/setSelectedIds'
    });
  });
})