import React from 'react';
import AdminPage from '../pages/admin';
import { render } from '../test_config/render';

jest.mock(
  '../components/shared/AuthWrapper',
  () =>
    function MockAuthWrapper({
      role,
      children,
    }: {
      role: string;
      children: any;
    }) {
      return <div data-testid={`auth=${role}`}>{children}</div>;
    }
);

jest.mock('../components/admin/userRoles', () => ({
  UserRolePanel: () => <div>User role panel mock</div>,
}));

describe('admin page', () => {
  it('renders correctly', () => {
    const { wrapper } = render(<AdminPage />);

    expect(wrapper.container).toMatchSnapshot();
  });
});
