import React from 'react';
import {render} from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import {BaseMapList} from './baseMapList';

describe(BaseMapList.name, () => {
  it('renders the correct number of base map overlays', () => {
    const baseMap = [{name: 'test_overlay', sourceLayer: 'test_layer', sourceType: 'test_type'},{name: 'test_overlay2', sourceLayer: 'test_layer2', sourceType: 'test_type2'}];
    const open = true;
    const setOpen = jest.fn();
    const openNestBasemapList = true;
    const setOpenNestBasemapList = jest.fn();
    render(<BaseMapList open={open} setOpen={setOpen} openNestBasemapList={openNestBasemapList} setOpenNestBasemapList={setOpenNestBasemapList} sectionTitle='Overlays' baseMap={baseMap} />);
    const numOverlays = screen.getByTestId('baseMapListContainer').children.length;
    expect(numOverlays == baseMap.length);
  });
});
