import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutPartner from './aboutPartner';
import { partners } from './data/partners';

describe(AboutPartner.name, () => {
  it('renders the correct number of partner panels', () => {
    const allPartners = partners.partnerList;
    render(<AboutPartner />);
    const numRenderedMembers = screen.getByTestId('partnerListContainer').children.length;
    expect(numRenderedMembers == allPartners.length);
  });
});
