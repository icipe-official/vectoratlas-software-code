import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutContact from './aboutContact';
import data from './data/contacts.json';

describe(AboutContact.name, () => {
  it('renders the correct number of contact panels', () => {
    const contactList = data;
    render(<AboutContact />);
    const numRenderedOffices = screen.getByTestId('officeListContainer').children.length;
    const numRenderedFieldStations = screen.getByTestId('fieldStationListContainer').children.length;
    expect(numRenderedOffices == contactList.offices.length);
    expect(numRenderedFieldStations == contactList.fieldStations.length);
  });
});
