import {render, fireEvent} from '../../test_config/render';
import {screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import UserInfo from './userInfo';


describe('UserInfo component', () => {
  it('does not display the menu items when icon is not clicked', () => {
    render(<UserInfo user={{nickname: 'Test user'}} />, {});
    expect(screen.queryByTestId('userMenu')).not.toBeInTheDocument();
    expect(screen.queryByTestId('userIcon')).toBeInTheDocument();
  });

  it('displays the menu items when icon is clicked', () => {
    render(<UserInfo user={{nickname: 'Test user'}} />, {});
    fireEvent.click(screen.getByTestId('userIcon'));
    expect(screen.queryByTestId('userMenu')).toBeInTheDocument();
  });
});
