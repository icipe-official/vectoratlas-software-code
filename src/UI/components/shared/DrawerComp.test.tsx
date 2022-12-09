import { renderWithUser } from '../../test_config/render';
import { act, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import DrawerComp from './DrawerComp';

describe('DrawerComp component', () => {
  it('looks if menu items cant be seen', async () => {
    await act(async () => {
      renderWithUser(<DrawerComp navItems={[]} />);
    });
    const menuit = screen.queryByTestId('listitem');
    expect(menuit).not.toBeInTheDocument();
  });

  it('Opens the menu when button is clicked', async () => {
    await act(async () => {
      renderWithUser(<DrawerComp navItems={[]} />);
    });    const openDraw = screen.getByTestId('openDrawer');

    fireEvent.click(openDraw);
    const drawElement = screen.queryByTestId('drawercomponent');

    expect(openDraw).toBeInTheDocument();
    expect(drawElement).toBeInTheDocument();
  });

  it('renders the nav items given', async () => {
    const navItems = [
      <p data-testid="item1" key="1">
        One
      </p>,
      <p data-testid="item2" key="2">
        Two
      </p>,
    ];
    await act(async () => {
      renderWithUser(<DrawerComp navItems={navItems} />);
    });
    const openDraw = screen.getByTestId('openDrawer');

    fireEvent.click(openDraw);
    const itemOne = screen.getByTestId('item1');
    const itemTwo = screen.getByTestId('item2');
    expect(itemOne).toBeInTheDocument();
    expect(itemTwo).toBeInTheDocument();
  });
});
