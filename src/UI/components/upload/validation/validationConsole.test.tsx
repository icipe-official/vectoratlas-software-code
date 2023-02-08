import { render } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import ValidationConsole from './validationConsole';
import reducer, {
  initialState,
  updateValidationErrors,
  UploadState,
} from '../../../state/upload/uploadSlice';
import { AppState } from '../../../state/store';

const errors = [
  {
    row: 1,
    data: [
      {
        key: 'test',
        errorType: 'Required data',
        expectedType: 'test',
      },
      {
        key: 'test2',
        errorType: 'Incorrect data type',
        expectedType: 'test2',
        receivedType: 'test2',
      },
    ],
  },
];

describe('Validation component', () => {
  it('renders validation console with no validation errors in state', () => {
    render(<ValidationConsole />, initialState());
    expect(screen.getByText('Validation Console')).toBeInTheDocument();
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
  });
  it('renders validation console with validation errors in state', () => {
    const state: Partial<AppState> = {
      upload: {
        ...initialState,
        validationErrors: errors,
      },
    };
    render(<ValidationConsole />, state);
    expect(screen.getByText('Validation Console')).toBeInTheDocument();
    expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
  });
});
