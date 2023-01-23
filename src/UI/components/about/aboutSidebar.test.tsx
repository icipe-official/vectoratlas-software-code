import AboutSidebar from './aboutSidebar';
import { renderWithUser } from '../../test_config/render';
import { act, screen } from '@testing-library/react';

describe('about Sidebar', () => {
  it('looks if menu items can be seen', async () => {
    await act(async () => {
      renderWithUser(<AboutSidebar />);
    });
    const menuit = screen.queryByTestId('listitem');
    expect(menuit).toBeInTheDocument();
  });
});
