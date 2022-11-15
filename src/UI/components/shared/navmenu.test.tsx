import { initialState } from '../../state/configSlice';
import { AppState } from '../../state/store';
import { render } from '../../test_config/render';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavMenu from './navmenu';

jest.mock(
  './navlink',
  () =>
    function MockNavLink({ text }: { text: string }) {
      return <div key={text} data-testid={text}>{text}</div>;
    }
);

describe('NavMenu component', () => {
  it('does not display the menu items when closed', () => {
    const options = [
      {text: 'Option1', url: '/1'},
      {text: 'Option2', url: '/2'},
    ]

    render(<NavMenu text='More' options={options} />, );
    expect(screen.queryByTestId('Option1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('Option2')).not.toBeInTheDocument();
    expect(screen.getByTestId('navlink More')).toHaveTextContent('More');
  });

  it('displays the menu items when open', () => {
    const options = [
      {text: 'Option1', url: '/1'},
      {text: 'Option2', url: '/2'},
    ]

    render(<NavMenu text='More' options={options} />, );

    const openButton = screen.getByTestId('open');
    fireEvent.click(openButton);

    expect(screen.queryByTestId('Option1')).toBeInTheDocument();
    expect(screen.queryByTestId('Option2')).toBeInTheDocument();
    expect(screen.getByTestId('navlink More')).toHaveTextContent('More');
  });
});
