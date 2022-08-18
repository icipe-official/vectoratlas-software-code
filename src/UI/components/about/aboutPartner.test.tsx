import React from 'react'; // or change tsconfig compilerOptions to 'jsx':'react-jsx'
import { render } from '@testing-library/react';
import {screen } from '@testing-library/dom';
import AboutPartner from './aboutPartner';
import {dummyPartners} from './dummyState';
describe(AboutPartner.name, () => {
  it('renders the correct number of partner panels', () => {
    const partnerList = dummyPartners.partners;
    render(<AboutPartner />);
    const numRenderedMembers = screen.getByTestId('partnerListContainer').children.length; //Return object of children. Only one child so simply index
    expect(numRenderedMembers == partnerList.length);
  });
});
