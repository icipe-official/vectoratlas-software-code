import React from 'react';
import { render } from '../../test_config/render';
import { screen, fireEvent } from '@testing-library/dom';
import { initialState } from '../../state/speciesInformation/speciesInformationSlice';
import SpeciesList from './speciesList';
import router from 'next/router';

const mockPush = jest.fn();
jest.spyOn(router, 'useRouter').mockReturnValue({
  push: mockPush,
});

describe('Species list testing', () => {
  let state: any;
  beforeEach(() => {
    state = { speciesInfo: initialState() };
    state.speciesInfo.speciesDict.items = [
      {
        id: 'test1',
        name: 'test1Name',
        shortDescription: 'test1ShortDesc',
        description: 'test1Desc',
        speciesImage: 'test1SpecImage',
      },
      {
        id: 'test2',
        name: 'test2Name',
        shortDescription: 'test2ShortDesc',
        description: 'test2Desc',
        speciesImage: 'test2SpecImage',
      },
    ];
  });

  describe('Species List is rendered correctly', () => {
    it('with the correct number of entries', () => {
      render(<SpeciesList />, state);
      const numOverlays = screen.getByTestId('speciesPanelGrid').children;
      expect(numOverlays).toHaveLength(2);
    });
    it('with each panel section visible', () => {
      render(<SpeciesList />, state);
      expect(screen.getByText('test1Name')).toBeVisible();
      expect(screen.getByText('test2Name')).toBeVisible();
      expect(screen.getByText('test1ShortDesc')).toBeVisible();
      expect(screen.getByText('test2ShortDesc')).toBeVisible();
    });
    it('with each panel section visible', () => {
      render(<SpeciesList />, state);
      expect(screen.getByText('test1Name')).toBeVisible();
      expect(screen.getByText('test2Name')).toBeVisible();
      expect(screen.getByText('test1ShortDesc')).toBeVisible();
      expect(screen.getByText('test2ShortDesc')).toBeVisible();
    });
    it('dispatches correct action and calls router.push onClick', () => {
      const { store } = render(<SpeciesList />, state);
      fireEvent.click(screen.getByTestId('speciesPaneltest1'));
      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        payload: 'test1',
        type: 'speciesInformation/setCurrentInfoDetails',
      });
      expect(mockPush).toBeCalledWith({
        pathname: '/species/details',
        query: { id: 'test1' },
      });
    });
  });
});
