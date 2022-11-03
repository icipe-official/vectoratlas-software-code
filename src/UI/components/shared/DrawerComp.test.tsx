
import { render, renderWithUser } from '../../test_config/render';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import DrawerComp from './DrawerComp';

describe('DrawerComp component', () => {
    

    it('looks if menu items cant be seen', () =>{
      renderWithUser(<DrawerComp/>)
      const menuit = screen.queryByTestId('listitem')
      expect(menuit).not.toBeInTheDocument();
    })

    it('Opens the menu when button is clicked', () => {
      renderWithUser(<DrawerComp />);
      const openDraw = screen.getByTestId('openDrawer')
     
      fireEvent.click(openDraw)
      const drawElement = screen.queryByTestId('drawercomponent')

      expect(openDraw).toBeInTheDocument();
      expect(drawElement).toBeInTheDocument();
    })
})