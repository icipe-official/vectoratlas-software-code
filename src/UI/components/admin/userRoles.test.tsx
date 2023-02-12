import React from 'react';
import { fireEvent, render } from '../../test_config/render';
import { UserRolePanel } from './userRoles';
import { AppState } from '../../state/store';
import { initialState } from '../../state/admin/adminSlice';
import { useRouter } from 'next/router';

jest.mock(
  '@mui/material/CircularProgress',
  () =>
    function CircularProgressMock() {
      return <div>Circular progress mock</div>;
    }
);

jest.mock('./userControl', () => ({
  UserControl: (props) => <div>User control mock {JSON.stringify(props)}</div>
}))

describe('UserRolePanel', () => {
  let state: Partial<AppState>;

  beforeEach(() => {
    jest.clearAllMocks();

    state = {
      admin: initialState(),
    };

  });

  it('shows loading spinning when loading', () => {
    state.admin.loading = true;

    const { wrapper } = render(<UserRolePanel />, state);

    expect(wrapper.getByText('Circular progress mock')).toBeInTheDocument();
  });

  it('renders correctly with users', () => {
    state.admin.users = [
      {
        auth0_id: 'A',
        email: 'user A',
        is_admin: true,
        is_editor: true,
        is_uploader: false,
        is_reviewer: false,
      },
      {
        auth0_id: 'B',
        email: 'user B',
        is_admin: false,
        is_editor: false,
        is_uploader: true,
        is_reviewer: false,
      }
    ]

    const { wrapper } = render(<UserRolePanel />, state);
    expect(wrapper.container).toMatchSnapshot();
  })
})