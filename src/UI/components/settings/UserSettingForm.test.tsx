import { AppState } from '../../state/store';
import { renderWithUser, render } from '../../test_config/render';
import { fireEvent, screen } from '@testing-library/react';
import UserSettingForm from './UserSettingForm';
import * as router from 'next/router';
import UserSettingPage from '../../pages/user_settings';
import UserInfo from '../shared/userInfo';
import { UserProvider } from '@auth0/nextjs-auth0';
import { act } from 'react-dom/test-utils';
import { initialState } from '../../state/auth/authSlice';

jest.mock('../../state/auth/actions/requestRoles', () => ({
  requestRoles: jest.fn(({ requestReason, rolesRequested, email }) => ({
    type: 'test-requestRoles',
    payload: { requestReason, rolesRequested, email },
  })),
}));

describe('UserSettingForm', () => {
  let state: Partial<AppState>;
  const user = {
    nickname: 'demo',
    name: 'demo',
    email: 'demo@mail.com',
  };
  const userRoles = ['uploader', 'reviewer'];

  beforeEach(() => {
    jest.clearAllMocks();

    state = { auth: initialState() };
  });

  it('name, email and roles list are present', () => {
    state.auth.roles = userRoles;
    renderWithUser(<UserSettingForm />, state, user);
    expect(screen.queryByTestId('emailfield')).toBeInTheDocument();
    expect(screen.queryByTestId('namefield')).toBeInTheDocument();
    expect(screen.queryByTestId('rolesList')).toBeInTheDocument();
  });

  it('role request section is hidden initially', () => {
    state.auth.roles = userRoles;
    renderWithUser(<UserSettingForm />, state, user);
    expect(screen.queryByTestId('roleJustification')).not.toBeInTheDocument();
  });

  it('role request section is revealed on click', () => {
    state.auth.roles = userRoles;
    renderWithUser(<UserSettingForm />, state, user);

    const toggle = screen.getByTestId('toggleRequest');
    fireEvent.click(toggle);
    expect(screen.queryByTestId('roleJustification')).toBeInTheDocument();
  });

  it('displays the correct checkboxes for roles', () => {
    state.auth.roles = userRoles;
    state.auth.roleRequestLoading = true;
    const { wrapper } = renderWithUser(<UserSettingForm />, state, user);

    const toggle = screen.getByTestId('toggleRequest');
    fireEvent.click(toggle);
    expect(
      wrapper.getByRole('checkbox', { name: 'admin' })
    ).toBeInTheDocument();
    expect(
      wrapper.getByRole('checkbox', { name: 'editor' })
    ).toBeInTheDocument();
  });

  it('role request button is disabled when loading', () => {
    state.auth.roles = userRoles;
    state.auth.roleRequestLoading = true;
    const { wrapper } = renderWithUser(<UserSettingForm />, state, user);

    const toggle = screen.getByTestId('toggleRequest');
    fireEvent.click(toggle);
    expect(
      wrapper.getByText('Submit request').closest('button')
    ).toHaveAttribute('disabled');
  });

  it('role request button is disabled when no roles selected', () => {
    state.auth.roles = userRoles;
    const { wrapper } = renderWithUser(<UserSettingForm />, state, user);

    const toggle = screen.getByTestId('toggleRequest');
    fireEvent.click(toggle);
    expect(
      wrapper.getByText('Submit request').closest('button')
    ).toHaveAttribute('disabled');
  });

  it('submitting role request fires action', () => {
    state.auth.roles = userRoles;
    const { wrapper, store } = renderWithUser(<UserSettingForm />, state, user);

    const toggle = screen.getByTestId('toggleRequest');
    fireEvent.click(toggle);
    const adminCheck = screen.getByRole('checkbox', { name: 'admin' });
    fireEvent.click(adminCheck);
    const inputs = wrapper.getAllByRole('textbox');
    fireEvent.change(inputs[2], { target: { value: 'Reason' } });

    const requestButton = screen.getByTestId('submitRequest');
    fireEvent.click(requestButton);

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual({
      payload: {
        email: 'demo@mail.com',
        requestReason: 'Reason',
        rolesRequested: ['admin'],
      },
      type: 'test-requestRoles',
    });
  });
});
