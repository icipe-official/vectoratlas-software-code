import React from 'react'; // or change tsconfig compilerOptions to 'jsx':'react-jsx'
import { render } from '@testing-library/react';
import {screen } from '@testing-library/dom';
import AboutPartnerPanel from './aboutPartnerPanel';
import {dummyPartners} from './dummyState';
describe(AboutPartnerPanel.name, () => {
  
  it('renders team partner panel correctly for each entry', () => {
    const partnerList = dummyPartners.partners;
    for (let i =0; i < partnerList.length; i++){
      const partner = partnerList[i];
      let partnerId = partner.id;
      let partnerName = partner.name;
      let homepage = partner.homepage;
      let imageURL=partner.imageURL;
      render(<AboutPartnerPanel key={partnerId} id ={partnerId}name={partnerName} homepage={homepage} imageURL={imageURL} />);
      expect( screen.getByTestId(`partnerPanelLink_${partnerId}`)).toHaveAttribute('href',homepage);
      expect( screen.getByTestId(`partnerPanelLogo_${partnerId}`)).toHaveAttribute('src',imageURL);
      expect( screen.getByTestId(`partnerPanelLogo_${partnerId}`)).toHaveAttribute('alt',partnerName);
    }
  });
});
