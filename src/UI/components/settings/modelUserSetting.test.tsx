import { AppState } from '../../state/store';
import { renderWithUser, render } from '../../test_config/render';
import { screen } from '@testing-library/react';
import UserSettingForm from './UserSettingForm';
import * as router from 'next/router';
import { initialState } from '../../state/auth/authSlice';
import UserSettingPage from '../../pages/user_settings';
import UserInfo from '../shared/userInfo';

describe('UserSettingForm', () => {
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
});
