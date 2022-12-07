import {
  setCurrentInfoForEditing,
  speciesInfoLoading,
} from '../speciesInformationSlice';
import {
  getSpeciesInformation,
  upsertSpeciesInformation,
} from './upsertSpeciesInfo.action';
import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
} from '../../../api/api';
import { toast } from 'react-toastify';
import { SpeciesInformation } from '../../state.types';
import { upsertSpeciesInformationMutation } from '../../../api/queries';

jest.mock('../../../api/api', () => ({
  fetchGraphQlDataAuthenticated: jest.fn(),
  fetchGraphQlData: jest.fn(),
}));

jest.mock('../../../api/queries', () => ({
  speciesInformationById: jest.fn((id) => 'speciesInformationById: ' + id),
  upsertSpeciesInformationMutation: jest
    .fn()
    .mockImplementation(
      (info) => 'upsertSpeciesInformationMutation: ' + info.id
    ),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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

  describe('getSpeciesInformation', () => {
    it('dispatches setCurrentInfoForEditing with the result from the API', async () => {
      const expectedSpeciesInformation = {
        name: 'test species',
        shortDescription: 'short test',
        description: 'description test',
      };

      (fetchGraphQlData as jest.Mock).mockResolvedValue({
        data: {
          speciesInformationById: expectedSpeciesInformation,
        },
      });

      await getSpeciesInformation('123-456')(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(fetchGraphQlData).toHaveBeenCalledWith(
        'speciesInformationById: 123-456'
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        speciesInfoLoading(true)
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        setCurrentInfoForEditing(expectedSpeciesInformation)
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        speciesInfoLoading(false)
      );
    });

    it('desanitises input for display', async () => {
      (fetchGraphQlData as jest.Mock).mockResolvedValue({
        data: {
          speciesInformationById: {
            description: 'description%20%C3%B2',
            id: '123-456',
            name: 'Test%20with%20special%20character%20%C3%A0',
            shortDescription: 'Short%20description%20%C3%A8',
          },
        },
      });

      await getSpeciesInformation('123-456')(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        setCurrentInfoForEditing({
          id: '123-456',
          name: 'Test with special character à',
          shortDescription: 'Short description è',
          description: 'description ò',
        })
      );
    });
  });

  describe('upsertSpeciesInformation', () => {
    let speciesInfo: SpeciesInformation;

    beforeEach(() => {
      jest.clearAllMocks();

      speciesInfo = {
        id: 'save-test-123',
        name: 'save test',
        shortDescription: 'short description',
        description: 'description',
      };

      (fetchGraphQlDataAuthenticated as jest.Mock).mockResolvedValue({
        data: {
          createEditSpeciesInformation: speciesInfo,
        },
      });
    });

    it('calls the API to save information correctly when updating and resets', async () => {
      await upsertSpeciesInformation(speciesInfo)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(fetchGraphQlDataAuthenticated).toHaveBeenCalledWith(
        'upsertSpeciesInformationMutation: save-test-123',
        'token12345'
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Updated species information with id save-test-123'
      );
      expect(mockThunkAPI.dispatch).toHaveBeenCalledWith(
        setCurrentInfoForEditing({
          name: '',
          shortDescription: '',
          description: '',
          speciesImage: '',
        })
      );
    });

    it('calls the API to save information correctly when creating and resets', async () => {
      delete speciesInfo.id;

      (fetchGraphQlDataAuthenticated as jest.Mock).mockResolvedValue({
        data: {
          createEditSpeciesInformation: {
            ...speciesInfo,
            id: 'created-new-id',
          },
        },
      });

      await upsertSpeciesInformation(speciesInfo)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(toast.success).toHaveBeenCalledWith(
        'New species information created with id created-new-id'
      );
    });

    it('santises input before sending to the API', async () => {
      speciesInfo.name = 'Test with special character à';
      speciesInfo.shortDescription = 'Short description è';
      speciesInfo.description = 'description ò';

      await upsertSpeciesInformation(speciesInfo)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(upsertSpeciesInformationMutation).toHaveBeenCalledWith({
        description: 'description%20%C3%B2',
        id: 'save-test-123',
        name: 'Test%20with%20special%20character%20%C3%A0',
        shortDescription: 'Short%20description%20%C3%A8',
      });
    });

    it('shows an error if upserting fails', async () => {
      (fetchGraphQlDataAuthenticated as jest.Mock).mockRejectedValue(
        new Error('test upsert fail')
      );

      await upsertSpeciesInformation(speciesInfo)(
        mockThunkAPI.dispatch,
        mockThunkAPI.getState,
        null
      );

      expect(toast.error).toHaveBeenCalledWith(
        'Unable to update species information'
      );
    });
  });
});
