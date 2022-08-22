import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutOfficePanel from './aboutOfficePanel';
import { contacts } from './data/contacts';

describe(AboutOfficePanel.name, () => {
  it('renders office panel correctly for each entry', () => {
    const offices = contacts.offices;
    for (let i = 0; i < offices.length; i++) {
      const office = offices[i];
      let officeId = office.id;
      let officeName = office.name;
      let address = office.address;
      let telephone = office.tel;
      let fax = office.fax;
      let email = office.email;
      render(<AboutOfficePanel key={officeId} id={officeId} name={officeName} address={address} tel={telephone} fax={fax} email={email} />);
      expect(screen.getByText(officeName)).toBeVisible();
      expect(screen.getByText(`Address: ${address}`)).toBeVisible();
      expect(screen.getByText(`Tel: ${telephone}`)).toBeVisible();
      expect(screen.getByText(`Fax: ${fax}`)).toBeVisible();
      expect(screen.getByText(`Email: ${email}`)).toBeVisible();
    }
  });
});
