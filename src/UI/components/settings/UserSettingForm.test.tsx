import { AppState } from '../../state/store';
import { renderWithUser, render } from '../../test_config/render';
import { fireEvent, screen } from '@testing-library/react';
import UserSettingForm from './UserSettingForm';
import * as router from 'next/router';
import { initialState } from '../../state/auth/authSlice';
import UserSettingPage from '../../pages/user_settings';
import UserInfo from '../shared/userInfo';
import { useRouter } from 'next/router';
import { UserProvider } from '@auth0/nextjs-auth0';
import { act } from 'react-dom/test-utils';


jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    push: jest.fn(),
  }),
}));

describe('UserSettingForm', () => {
  let state: Partial<AppState>;

  it('name, email and roles list are present', () => {
    render(
      <UserSettingForm
        user={{
          nickname: 'demo',
          name: 'demo',
          email: 'demo@mail.com',
        }}
        userRoles={['uploader', 'reviewer']}
      ></UserSettingForm>
    );
    expect(screen.queryByTestId('emailfield')).toBeInTheDocument();
    expect(screen.queryByTestId('namefield')).toBeInTheDocument();
    expect(screen.queryByTestId('rolesList')).toBeInTheDocument();
  });

  it('navigates to login when not connected', () => {
    const { wrapper } = render(
      <UserProvider>
        <UserSettingPage />
      </UserProvider>, state);
    expect(useRouter().push).toHaveBeenCalledWith('/api/auth/login');
  });

});
