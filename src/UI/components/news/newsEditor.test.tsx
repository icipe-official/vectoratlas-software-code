import React from 'react';
import { fireEvent, render, waitFor } from '../../test_config/render';
import NewsEditor from './newsEditor';
import { useRouter } from 'next/router';
import { AppState } from '../../state/store';
import { initialState } from '../../state/news/newsSlice';
import { toast } from 'react-toastify';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock('../shared/textEditor/RichTextEditor', () => ({
  TextEditor: (props) => <div>Text editor mock: {JSON.stringify(props)}</div>,
}));

jest.mock('../../state/news/actions/news.action', () => ({
  getNews: jest.fn((id) => ({
    type: 'test-getNews',
    payload: id,
  })),
  upsertNews: jest.fn((news) => ({
    type: 'test-upsertNews',
    payload: news,
  })),
}));

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

describe('NewsEditor', () => {
  let state: Partial<AppState>;

  beforeEach(() => {
    jest.clearAllMocks();

    state = {
      news: initialState(),
    };

    (useRouter as jest.Mock).mockReturnValue({ query: {} });
  });

  it('starts with validation errors when creating', () => {
    const { wrapper } = render(<NewsEditor />);
    expect(wrapper.getByText('Create news item')).toBeInTheDocument();
    expect(wrapper.getByText('Title cannot be empty')).toBeInTheDocument();
    expect(
      wrapper.getByText('"helperText":"Summary cannot be empty"', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(wrapper.getByText('Create').closest('button')).toHaveAttribute(
      'disabled'
    );
  });

  it('dispatches an action to load news if there is an id', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: '123-456' } });

    const { store } = render(<NewsEditor />);
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'test-getNews',
      payload: '123-456',
    });
  });

  it('shows progress spinner and disables fields when loading', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: '123-456' } });
    state.news.loading = true;

    const { wrapper } = render(<NewsEditor />, state);

    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
    const inputs = wrapper.getAllByRole('textbox');
    expect(inputs[0]).toHaveAttribute('disabled');
    expect(wrapper.getByText('Update').closest('button')).toHaveAttribute(
      'disabled'
    );
  });

  it('populates the form correctly when news is loaded', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: '123-456' } });
    state.news.currentNewsForEditing = {
      id: '123-456',
      title: 'test title',
      summary: 'test summary',
      article: 'test article',
      image: '',
    };

    const { wrapper } = render(<NewsEditor />, state);

    expect(
      wrapper.queryByText('Circular progress mock')
    ).not.toBeInTheDocument();
    expect(wrapper.getByDisplayValue('test title')).toBeInTheDocument();
    expect(
      wrapper.getByText('test summary', { exact: false })
    ).toBeInTheDocument();
    expect(
      wrapper.getByText('test article', { exact: false })
    ).toBeInTheDocument();
  });

  it('saves news item with the right details', () => {
    state.news.currentNewsForEditing = {
      id: '123-456',
      title: 'original title',
      summary: 'test summary',
      article: 'test article',
      image: '',
    };

    const { wrapper, store } = render(<NewsEditor />, state);

    const inputs = wrapper.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'entered title' } });

    fireEvent.click(wrapper.getByText('Create'));

    const actions = store.getActions();
    const expectedSpeciesInfo = {
      id: undefined,
      title: 'entered title',
      summary: 'test summary',
      article: 'test article',
      image: '',
    };
    expect(actions[0]).toEqual({
      type: 'test-upsertNews',
      payload: expectedSpeciesInfo,
    });
  });

  it('sets image when user uploads file', async () => {
    const { wrapper } = render(<NewsEditor />, state);

    const input = wrapper.getByTestId('image-upload-input');

    fireEvent.change(input, {
      target: {
        files: [new File(['aaaaaaaaaaa'], 'test-file')],
      },
    });

    await waitFor(() => {
      const image = wrapper.getByRole('img').getAttribute('src');
      expect(image).toEqual(
        'data:application/octet-stream;base64,YWFhYWFhYWFhYWE='
      );
    });
  });

  it('displays an error if the file is above 512KB', async () => {
    const { wrapper } = render(<NewsEditor />, state);

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
