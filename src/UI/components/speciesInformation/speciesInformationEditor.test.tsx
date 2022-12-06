import React from 'react';
import { act, fireEvent, render, waitFor } from '../../test_config/render';
import SpeciesInformationEditor from './speciesInformationEditor';
import { useRouter } from 'next/router';
import { AppState } from '../../state/store';
import { initialState } from '../../state/speciesInformation/speciesInformationSlice';
import { toast } from 'react-toastify';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock('../shared/textEditor/RichTextEditor', () => ({
  TextEditor: ({ description }) => <div>Text editor mock: {description}</div>,
}));

jest.mock(
  '../../state/speciesInformation/actions/upsertSpeciesInfo.action',
  () => ({
    getSpeciesInformation: jest.fn((id) => ({
      type: 'test-getSpeciesInformation',
      payload: id,
    })),
    upsertSpeciesInformation: jest.fn((info) => ({
      type: 'test-upsertSpeciesInformation',
      payload: info,
    })),
  })
);

jest.mock(
  '@mui/material/CircularProgress',
  () =>
    function CircularProgressMock() {
      return <div>Circular progress mock</div>;
    }
);

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('SpeciesInformationEditor', () => {
  let state: Partial<AppState>;

  beforeEach(() => {
    jest.clearAllMocks();

    state = {
      speciesInfo: initialState(),
    };

    (useRouter as jest.Mock).mockReturnValue({ query: {} });
  });

  it('starts with validation errors when creating', () => {
    const { wrapper } = render(<SpeciesInformationEditor />);
    expect(wrapper.getByText('Create species information')).toBeInTheDocument();
    expect(wrapper.getByText('Name cannot be empty')).toBeInTheDocument();
    expect(
      wrapper.getByText('Short description cannot be empty')
    ).toBeInTheDocument();
    expect(wrapper.getByText('Create').closest('button')).toHaveAttribute(
      'disabled'
    );
  });

  it('dispatches an action to load species information if there is an id', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: '123-456' } });

    const { store } = render(<SpeciesInformationEditor />);
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'test-getSpeciesInformation',
      payload: '123-456',
    });
  });

  it('shows progress spinner and disables fields when loading', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: '123-456' } });
    state.speciesInfo.loading = true;

    const { wrapper } = render(<SpeciesInformationEditor />, state);

    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
    const inputs = wrapper.getAllByRole('textbox');
    expect(inputs[0]).toHaveAttribute('disabled');
    expect(inputs[1]).toHaveAttribute('disabled');
    expect(wrapper.getByText('Update').closest('button')).toHaveAttribute(
      'disabled'
    );
  });

  it('populates the form correctly when species information is loaded', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: '123-456' } });
    state.speciesInfo.currentInfoForEditing = {
      id: '123-456',
      name: 'test name',
      shortDescription: 'test short description',
      description: 'test description',
      speciesImage: '',
    };

    const { wrapper } = render(<SpeciesInformationEditor />, state);

    expect(
      wrapper.queryByText('Circular progress mock')
    ).not.toBeInTheDocument();
    expect(wrapper.getByDisplayValue('test name')).toBeInTheDocument();
    expect(wrapper.getByText('test short description')).toBeInTheDocument();
    expect(
      wrapper.getByText('test description', { exact: false })
    ).toBeInTheDocument();
  });

  it('saves species information with the right details', () => {
    const { wrapper, store } = render(<SpeciesInformationEditor />, state);

    const inputs = wrapper.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'entered name' } });
    fireEvent.change(inputs[1], {
      target: { value: 'entered short description' },
    });

    fireEvent.click(wrapper.getByText('Create'));

    const actions = store.getActions();
    const expectedSpeciesInfo = {
      id: undefined,
      name: 'entered name',
      shortDescription: 'entered short description',
      description: '',
      speciesImage: '',
    };
    expect(actions[0]).toEqual({
      type: 'test-upsertSpeciesInformation',
      payload: expectedSpeciesInfo,
    });
  });

  it('sets image when user uploads file', async () => {
    const { wrapper } = render(<SpeciesInformationEditor />, state);

    const input = wrapper.getByTestId('image-upload-input');

    fireEvent.change(input, {
      target: {
        files: [new File(['aaaaaaaaaaa'], 'test-file')],
      },
    });

    await waitFor(() => {
      const speciesImg = wrapper.getByRole('img').getAttribute('src');
      expect(speciesImg).toEqual(
        'data:application/octet-stream;base64,YWFhYWFhYWFhYWE='
      );
    });
  });

  it('displays an error if the file is above 512KB', async () => {
    const { wrapper } = render(<SpeciesInformationEditor />, state);

    const input = wrapper.getByTestId('image-upload-input');

    fireEvent.change(input, {
      target: {
        files: [
          new File(
            [...Array(512 * 1024)].map((_) => 'a'),
            'test-file'
          ),
        ],
      },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Uploaded files must be less than 512 KB.',
        { autoClose: 5000 }
      );
    });
  });
});
