import { fireEvent, getByTestId} from '@testing-library/react';
import { render } from '../../test_config/render';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import SourceForm from './source_form';


describe('SourceForm component', () => {
  it('renders', () => {
    render(<SourceForm/>);
    const sourceForms = screen.getByTestId(`sourceform`);
    expect(sourceForms).toBeInTheDocument();
  });

  it('submits data when form is filled',() => {
    render(<SourceForm />);
    const sourceButton = screen.getByTestId(`sourcebutton`);
    fireEvent.click(sourceButton);
    expect(sourceButton).toBeInTheDocument();
  })
});
