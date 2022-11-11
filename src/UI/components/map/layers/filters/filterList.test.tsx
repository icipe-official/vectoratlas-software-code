import React from 'react';
import { fireEvent, render } from '../../../../test_config/render';
import { drawerListToggle, drawerToggle, initialState } from "../../../../state/map/mapSlice";
import { FilterList } from './filterList';

jest.mock('@mui/material/ListItemIcon', () => () => (<div>ListItemIcon icon</div>))
jest.mock('@mui/icons-material/ExpandLess', () => () => (<div>ExpandLess icon</div>))
jest.mock('@mui/material/ListItemText', () => (props) => (<div>List item text mock {JSON.stringify(props)}</div>))
jest.mock('@mui/material/ListItemButton', () => (props) => (
  <div onClick={props.onClick}>
    <div>List item button mock</div>
    {props.children}
  </div>
))

jest.mock('./filterDropDown', () => (props) => (<div>FilterDropDown mock {JSON.stringify(props)}</div>))
jest.mock('./filterToggle', () => (props) => (
  <div>FilterToggle mock {"title: " + props.filterTitle}{"name: " + props.filterName}{"toggle type: " + props.filterToggleType}</div>
))
jest.mock('./dateFilter', () => (props) => (<div>DateFilter mock {JSON.stringify(props)}</div>))

describe("FilterList", () => {
  let state;

  beforeEach(() => {
    state = { map: initialState() };
  })

  it('renders correctly when collapsed', () => {
    const { wrapper } = render(
      <FilterList sectionTitle="Filters" sectionFlag="filters" />,
      state
    );

    expect(wrapper.container).toMatchSnapshot();
  })

  it('renders correctly when expanded', () => {
    state.map.map_drawer.open = true;
    state.map.map_drawer.filters = true;

    const { wrapper } = render(
      <FilterList sectionTitle="Filters" sectionFlag="filters" />,
      state
    );

    expect(wrapper.container).toMatchSnapshot();
  })

  it('closes just the section if the drawer is open', async () => {
    state.map.map_drawer.open = true;
    state.map.map_drawer.filters = true;

    const { wrapper, store } = render(
      <FilterList sectionTitle="Filters" sectionFlag="filters" />,
      state
    );

    const sectionButton = await wrapper.findByText("List item button mock");
    fireEvent.click(sectionButton)

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual(drawerListToggle('filters'))
  })

  it('opens the drawer and the section if the drawer is closed', async () => {
    state.map.map_drawer.open = false;

    const { wrapper, store } = render(
      <FilterList sectionTitle="Filters" sectionFlag="filters" />,
      state
    );

    const sectionButton = await wrapper.findByText("List item button mock");
    fireEvent.click(sectionButton)

    const actions = store.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[0]).toEqual(drawerToggle())
    expect(actions[1]).toEqual(drawerListToggle('filters'))
  })
})