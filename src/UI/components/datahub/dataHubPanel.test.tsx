import { renderWithUser } from '../../test_config/render';
import { screen } from '@testing-library/react';
import DataHubPanel from './dataHubPanel';

jest.mock('../../state/auth/actions/requestRoles', () => ({
  requestRoles: jest.fn(({ requestReason, rolesRequested, email }) => ({
    type: 'test-requestRoles',
    payload: { requestReason, rolesRequested, email },
  })),
}));

describe('DataHubPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('upload_model_div and upload_data_div are present', () => {
    renderWithUser(<DataHubPanel />);
    expect(screen.queryByTestId('upload_model')).toBeInTheDocument();
    expect(screen.queryByTestId('upload_data')).toBeInTheDocument();
  });
});
