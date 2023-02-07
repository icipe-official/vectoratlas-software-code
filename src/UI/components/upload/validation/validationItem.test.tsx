import { render } from '../../../test_config/render';
import { fireEvent, screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { AppState } from '../../../state/store';
import reducer, {
  initialState,
  updateValidationErrors,
} from '../../../state/upload/uploadSlice';
import Validationitem from './validationItem';

const errors = [
  {
    row: 1,
    data: [
      {
        key: 'test',
        errorType: 'Required data',
        expectedType: 'test',
        receivedType: 'test',
      },
    ],
  },
  {
    row: 1,
    data: [
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
  let state: Partial<AppState>;
  state = {
    upload: initialState(),
  };
  it('renders validation item with reqwuired validation error', () => {
    render(<Validationitem key={1} validationRow={errors[0]} />);
    expect(screen.getByText('Error -')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('RequiredButton'));
    expect(screen.getByTestId('requiredTypography')).toBeInTheDocument();
  });
  it('renders validation item with type validation error', () => {
    render(<Validationitem key={1} validationRow={errors[1]} />);
    expect(screen.getByText('Error -')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('TypeButton'));
    expect(screen.getByTestId('typeTypography')).toBeInTheDocument();
  });
});
