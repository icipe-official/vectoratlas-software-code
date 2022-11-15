import { render, renderWithUser } from '../../test_config/render';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import DrawerComp from './DrawerComp';

describe('DrawerComp component', () => {
  it('looks if menu items cant be seen', () => {
    renderWithUser(<DrawerComp navItems={[]} />);
    const menuit = screen.queryByTestId('listitem');
    expect(menuit).not.toBeInTheDocument();
  });

  it('Opens the menu when button is clicked', () => {
    renderWithUser(<DrawerComp navItems={[]} />);
    const openDraw = screen.getByTestId('openDrawer');

    fireEvent.click(openDraw);
    const drawElement = screen.queryByTestId('drawercomponent');

    expect(openDraw).toBeInTheDocument();
    expect(drawElement).toBeInTheDocument();
  });

  it('renders the nav items given', () => {
    const navItems = [<p data-testid='item1'>One</p>, <p data-testid='item2'>Two</p>]
    renderWithUser(<DrawerComp navItems={navItems} />);
    const openDraw = screen.getByTestId('openDrawer');

    fireEvent.click(openDraw);
    const itemOne = screen.getByTestId('item1');
    const itemTwo = screen.getByTestId('item2');
    expect(itemOne).toBeInTheDocument();
    expect(itemTwo).toBeInTheDocument();
  });
});
