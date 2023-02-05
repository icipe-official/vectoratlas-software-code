import { render } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import ValidationConsole from './validationConsole';
import { AppState } from '../../../state/store';
import { initialState } from '../../../state/upload/uploadSlice';
import { useAppSelector } from '../../../state/hooks';

jest.mock('../../../state/hooks', () => ({
  useAppSelector: jest
    .fn()
    .mockReturnValueOnce([])
    .mockReturnValue([
      {
        row: 1,
        data: [
          {
            key: 'test',
            errorType: 'test',
            expectedType: 'test',
            receivedType: 'test',
          },
        ],
      },
      {
        row: 2,
        data: [
          {
            key: 'test2',
            errorType: 'test2',
            expectedType: 'test2',
            receivedType: 'test2',
          },
        ],
      },
    ]),
}));

describe('Validation component', () => {
  let state: Partial<AppState>;
  state = {
    upload: initialState(),
  };
  it('renders validation console with no validation errors', () => {
    render(<ValidationConsole />, state);
    expect(screen.getByText('Validation Console')).toBeInTheDocument();
    expect(useAppSelector).toBeCalled();
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
  });
  it('renders validation console with validation errors', () => {
    render(<ValidationConsole />);
    expect(screen.getByText('Validation Console')).toBeInTheDocument();
    expect(useAppSelector).toBeCalled();
    expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
  });
});
