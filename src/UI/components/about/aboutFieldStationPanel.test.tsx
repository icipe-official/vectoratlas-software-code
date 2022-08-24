import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutFieldStationPanel from './aboutFieldStationPanel';
import { contacts } from './data/contacts';

describe(AboutFieldStationPanel.name, () => {
  it('renders field station panel correctly for each entry', () => {
    const fieldStations = contacts.fieldStations;
    for (let i = 0; i < fieldStations.length; i++) {
      const station = fieldStations[i];
      let stationId = station.id;
      let stationName = station.name;
      let telephone = station.tel;
      let fax = station.fax;
      let location = station.physicalLoc;
      render(<AboutFieldStationPanel key={stationId} id={stationId} name={stationName} tel={telephone} fax={fax} physicalLoc={location} />);
      expect(screen.getByText(stationName)).toBeVisible();
      expect(screen.getByText(`Tel: ${telephone}`)).toBeVisible();
      expect(screen.getByText(`Fax: ${fax}`)).toBeVisible();
      expect(screen.getByTestId(`fieldStationLocation_Link_${stationId}`)).toBeVisible();
      expect(screen.getByTestId(`fieldStationLocation_Link_${stationId}`)).toHaveAttribute('href', location);
    }
  });
});
