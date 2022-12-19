import { act, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../test_config/render';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import SourceForm from './source_form';

jest.mock('axios');
jest.mock('@mui/x-date-pickers', () => {
  return {
    DatePicker: jest.requireActual('@mui/x-date-pickers').DesktopDatePicker,
    LocalizationProvider: jest.requireActual('@mui/x-date-pickers')
      .LocalizationProvider,
  };
});

describe('SourceForm component', () => {
  it('renders', () => {
    render(<SourceForm />);
    const sourceForms = screen.getByTestId('sourceform');
    expect(sourceForms).toBeInTheDocument();
  });

  it('submits data action when form is filled', async () => {
    const { wrapper, store } = render(<SourceForm />);

    await act(async () => {
      fireEvent.input(
        screen.getByRole('textbox', { name: /Article Title:/i }),
        {
          target: { value: 'Title 1' },
        }
      );
      fireEvent.input(screen.getByRole('textbox', { name: /Author/i }), {
        target: { value: 'Author 1' },
      });
      fireEvent.input(
        screen.getByRole('textbox', { name: /Journal Title:/i }),
        {
          target: { value: 'Journal 1' },
        }
      );
      fireEvent.input(screen.getByRole('textbox', { name: /Report Type:/i }), {
        target: { value: 'Title 1' },
      });
      const yearDate = await wrapper.getAllByRole('textbox');
      fireEvent.change(yearDate[4], { target: { value: 1990 } });

      return undefined;
    });
    expect(store.getActions()).toHaveLength(0);

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual(
        expect.objectContaining({
          meta: expect.objectContaining({
            arg: expect.objectContaining({ article_title: 'Title 1' }),
          }),
        })
      );
    });
  });

  it('does not submit data action when form has not got required fields', async () => {
    const { store } = render(<SourceForm />);
    expect(store.getActions()).toHaveLength(0);

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));
    });
    await waitFor(() => {
      expect(store.getActions()).toHaveLength(0);
    });
  });
});
