import { setCurrentInfoForEditing } from '../speciesInformationSlice';
import {
  getSpeciesInformation,
  upsertSpeciesInformation,
} from './upsertSpeciesInfo.action';
import { fetchGraphQlDataAuthenticated } from '../../../api/api';

jest.mock('../../../api/api', () => ({
  fetchGraphQlDataAuthenticated: jest.fn(),
}));

jest.mock('../../../api/queries', () => ({
  speciesInformationById: jest.fn((id) => 'speciesInformationById: ' + id),
  upsertSpeciesInformationMutation: jest
    .fn()
    .mockImplementation(
      (info) => 'upsertSpeciesInformationMutation: ' + info.id
    ),
}));

describe('species info actions', () => {
  let mockThunkAPI: any;

  beforeEach(() => {
    mockThunkAPI = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };

    mockThunkAPI.getState.mockReturnValue({
      auth: {
        token: 'token12345',
      },
    });
  });

  it('getSpeciesInformation dispatches setCurrentInfoForEditing with the result from the API', async () => {
    const expectedSpeciesInformation = {
      name: 'test species',
    };

    (fetchGraphQlDataAuthenticated as jest.Mock).mockResolvedValue({
      data: {
        speciesInformationById: expectedSpeciesInformation,
      },
    });

    await getSpeciesInformation('123-456')(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(fetchGraphQlDataAuthenticated).toHaveBeenCalledWith(
      'speciesInformationById: 123-456',
      'token12345'
    );
    expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
      setCurrentInfoForEditing(expectedSpeciesInformation)
    );
  });

  it('upsertSpeciesInformation calls the API to save information correctly', async () => {
    const speciesInfo = {
      id: 'save-test-123',
      name: 'save test',
      shortDescription: 'short description',
      description: 'description',
    };

    await upsertSpeciesInformation(speciesInfo)(
      mockThunkAPI.dispatch,
      mockThunkAPI.getState,
      null
    );

    expect(fetchGraphQlDataAuthenticated).toHaveBeenCalledWith(
      'upsertSpeciesInformationMutation: save-test-123',
      'token12345'
    );
  });
});
