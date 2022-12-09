import { initialState } from '../speciesInformationSlice';
import { fetchGraphQlData } from '../../../api/api';
import { getAllSpecies } from './getAllSpecies';
import { allSpecies } from '../../../api/queries';
import { unsanitiseSpeciesInformation } from './upsertSpeciesInfo.action';
import mockStore from '../../../test_config/mockStore';
import { waitFor } from '@testing-library/react';

jest.mock('../../../api/api', () => ({
  fetchGraphQlData: jest.fn().mockResolvedValue({
    data: {
      allSpeciesInformation: [
        {
          id: 'test1',
          name: 'test1',
          shortDescription: 'test1',
          description: 'test1',
          speciesImage: 'test1',
        },
        {
          id: 'test2',
          name: 'test2',
          shortDescription: 'test2',
          description: 'test2',
          speciesImage: 'test2',
        },
      ],
    },
  }),
}));

jest.mock('./upsertSpeciesInfo.action', () => ({
  unsanitiseSpeciesInformation: jest.fn(),
}));

describe('getAllSpecies', () => {
  const pending = { type: getAllSpecies.pending.type };
  const fulfilled = {
    type: getAllSpecies.fulfilled.type,
    payload: 'getAllSpecies',
  };
  const rejected = { type: getAllSpecies.rejected.type };
  const { store } = mockStore({ speciesInfo: initialState() });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSpecies', () => {
    it('calls on fetchGraphQlData with the appropriate query and returns expected action types', async () => {
      store.dispatch(getAllSpecies());

      expect(fetchGraphQlData).toHaveBeenCalledWith(allSpecies());

      const actions = store.getActions();
      await waitFor(() => expect(actions).toHaveLength(2));
      expect(actions[0].type).toEqual(pending.type);
      expect(actions[1].type).toEqual(fulfilled.type);
    });
  });
});
