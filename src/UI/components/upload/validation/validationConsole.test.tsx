import { render } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import ValidationConsole from './validationConsole';
import { AppState } from '../../../state/store';
import reducer, { initialState, setModelFile, updateValidationErrors } from '../../../state/upload/uploadSlice';

const error1 = {
  row: 1,
  data: {
    row: 2,
    key: 'test',
    errorType: 'test',
    expectedType: 'test',
    receivedType: 'test'
  }
};

jest.mock('../../../state/hooks', () => ({
  useAppSelector: jest.fn()
    .mockReturnValueOnce([])
    .mockReturnValueOnce(error1),
}));

describe('Validation component', () => {
  let state: Partial<AppState>;
  state = {
   upload: initialState(),
  };
  it('renders validation console with no validation errors', () => {
    render(<ValidationConsole/>, state);
    expect(screen.getByText('Validation Console')).toBeInTheDocument();
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
  });
  it('renders validation console with validation errors', () => {
    render(<ValidationConsole/>);
    expect(screen.getByText('Validation Console')).toBeInTheDocument();
    expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
  });
});
