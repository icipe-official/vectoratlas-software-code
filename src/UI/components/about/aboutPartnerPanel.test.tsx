import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutPartnerPanel from './aboutPartnerPanel';
import { partners } from './data/partners';

describe(AboutPartnerPanel.name, () => {
  it('renders team partner panel correctly for each entry', () => {
    const allPartners = partners.partnerList;
    for (let i = 0; i < allPartners.length; i++) {
      const partner = allPartners[i];
      let partnerId = partner.id;
      let partnerName = partner.name;
      let homepage = partner.homepage;
      let imageURL = partner.imageURL;
      render(<AboutPartnerPanel key={partnerId} id={partnerId} name={partnerName} homepage={homepage} imageURL={imageURL} />);
      expect(screen.getByTestId(`partnerPanelLink_${partnerId}`)).toHaveAttribute('href', homepage);
      expect(screen.getByTestId(`partnerPanelLogo_${partnerId}`)).toHaveAttribute('src', imageURL);
      expect(screen.getByTestId(`partnerPanelLogo_${partnerId}`)).toHaveAttribute('alt', partnerName);
    }
  });
});
