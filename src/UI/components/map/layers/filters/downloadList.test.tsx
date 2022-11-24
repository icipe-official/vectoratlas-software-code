import React from 'react';
import { fireEvent, render } from '../../../../test_config/render';
import {
  drawerListToggle,
  drawerToggle,
  initialState,
} from '../../../../state/map/mapSlice';
import DownloadList from './downloadList';

/* eslint-disable react/display-name*/
jest.mock('@mui/material/ListItemIcon', () => () => (
  <div>ListItemIcon icon</div>
));
jest.mock('@mui/icons-material/ExpandLess', () => () => (
  <div>ExpandLess icon</div>
));
jest.mock('@mui/material/ListItemText', () => (props: any) => (
  <div>List item text mock {JSON.stringify(props)}</div>
));
jest.mock('@mui/material/ListItemButton', () => (props: any) => (
  <div onClick={props.onClick}>
    <div>List item button mock</div>
    {props.children}
  </div>
));

/* eslint-enable react/display-name*/

describe('DownloadList', () => {
  let state: any;

  beforeEach(() => {
    state = { map: initialState() };
  });

  it('renders correctly when collapsed', () => {
    const { wrapper } = render(
      <DownloadList sectionTitle="Download" sectionFlag="download" />,
      state
    );

    expect(wrapper.container).toMatchSnapshot();
  });

  it('renders correctly when expanded', () => {
    state.map.map_drawer.open = true;
    state.map.map_drawer.download = true;

    const { wrapper } = render(
      <DownloadList sectionTitle="Download" sectionFlag="download" />,
      state
    );

    expect(wrapper.container).toMatchSnapshot();
  });

  it('closes just the section if the drawer is open', async () => {
    state.map.map_drawer.open = true;
    state.map.map_drawer.download = true;

    const { wrapper, store } = render(
      <DownloadList sectionTitle="Download" sectionFlag="download" />,
      state
    );

    const sectionButton = await wrapper.findByText('List item button mock');
    fireEvent.click(sectionButton);

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual(drawerListToggle('download'));
  });

  it('opens the drawer and the section if the drawer is closed', async () => {
    state.map.map_drawer.open = false;

    const { wrapper, store } = render(
      <DownloadList sectionTitle="Download" sectionFlag="download" />,
      state
    );

    const sectionButton = await wrapper.findByText('List item button mock');
    fireEvent.click(sectionButton);

    const actions = store.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[0]).toEqual(drawerToggle());
    expect(actions[1]).toEqual(drawerListToggle('download'));
  });
});
