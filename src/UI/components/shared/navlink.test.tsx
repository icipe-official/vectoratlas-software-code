import {render} from '../../test_config/render';
import NavLink from './navlink';
import {screen} from '@testing-library/react';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

describe('NavLink', () => {
  it('is styled correctly when inactive', () => {
    useRouter.mockImplementationOnce(() => ({
      pathname: '/map'
    }));
    render(<NavLink url='/' text='Home' />, {});
    expect(screen.getByTestId('navlink Home').querySelector('a')).not.toHaveStyle("textDecoration: 'underline'");
  });

  it('is styled correctly when active', () => {
    useRouter.mockImplementationOnce(() => ({
      pathname: '/map'
    }));
    render(<NavLink url='/map' text='Map' />, {});
    expect(screen.getByTestId('navlink Map').querySelector('a')).toHaveStyle("textDecoration: underline");
  });
});
