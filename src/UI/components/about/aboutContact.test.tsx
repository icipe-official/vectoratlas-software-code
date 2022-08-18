import React from 'react'; // or change tsconfig compilerOptions to 'jsx':'react-jsx'
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutContact from './aboutContact';

describe(AboutContact.name, () => {
  it('renders and displays the dummy data correctly', () => {
    render(<AboutContact />);
    expect(screen.getByText('Head Office')).toBeVisible();
    expect(screen.getByText('International Centre of Insect Physiology and Ecology (icipe)')).toBeVisible();
    expect(screen.getByText('Address: P.O. Box 30772-00100 Nairobi, Kenya')).toBeVisible();
    expect(screen.getByText('Tel: +254-20-8632000')).toBeVisible();
    expect(screen.getByText('Fax: +254-20-86322001/8632002')).toBeVisible();
    expect(screen.getByText('Email: icipe@icipe.org')).toBeVisible();
    expect(screen.getByText('Field Stations')).toBeVisible();
    expect(screen.getByText('Randville Campus')).toBeVisible();
    expect(screen.getByText('Tel: +254-12-8632000')).toBeVisible();
    expect(screen.getByText('Fax: +224-20-86322001/8632002')).toBeVisible();
  });
  it('redirects to maps on click to view location of Field Station', () => {
    render(<AboutContact />);
    
  }
});
