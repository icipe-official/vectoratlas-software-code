import React from 'react';
import '@testing-library/jest-dom';
import { render } from '../../test_config/render';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import SpeciesDetails from '../../pages/species/details';
import { initialState } from '../../state/speciesInformation/speciesInformationSlice';
import { useRouter } from 'next/router';

jest.mock(
  'react-markdown',
  () =>
    function MockReactMarkdown() {
      return <div data-testid={'reactMarkDown'}>React Mark Down</div>;
    }
);

jest.mock(
  '../../state/speciesInformation/actions/upsertSpeciesInfo.action',
  () => ({
    getSpeciesInformation: jest.fn((id) => ({
      type: 'test-getSpeciesInformation',
      payload: id,
    })),
  })
);

const pushMock = jest.fn();
jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { id: 'test' },
      push: pushMock,
    };
  },
}));

describe('species information edit page', () => {
  let state: any;
  beforeEach(() => {
    state = { speciesInfo: initialState() };
    jest.clearAllMocks;
  });
  it('dispatches correct action on page load', async () => {
    const { store } = render(<SpeciesDetails />, state);
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      payload: 'test',
      type: 'test-getSpeciesInformation',
    });
  });
  it('calls on router when back button is pressed', () => {
    render(<SpeciesDetails />, state);
    fireEvent.click(screen.getByText('Back to Species List'));
    expect(pushMock).toBeCalledWith('/species');
  });
});
