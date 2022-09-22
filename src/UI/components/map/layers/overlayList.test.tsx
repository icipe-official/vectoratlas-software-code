import React from 'react';
import {render} from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import {OverlayList} from './overlayList';

describe(OverlayList.name, () => {
  it('renders the correct number of overlays', () => {
    const overlays = [{name: 'test_overlay', sourceLayer: 'test_layer', sourceType: 'test_type'}];
    const open = true;
    const setOpen = jest.fn();
    const openNestOverlayList = true;
    const setOpenNestOverlayList = jest.fn();
    render(<OverlayList open={open} setOpen={setOpen} openNestOverlayList={openNestOverlayList} setOpenNestOverlayList={setOpenNestOverlayList} sectionTitle='Overlays' overlays={overlays} />);
    const numOverlays = screen.getByTestId('overlayListContainer').children.length;
    expect(numOverlays == overlays.length);
  });
});
