import React from 'react'
import '@testing-library/jest-dom';
import SpeciesInformationEditorPage from '../../pages/species/edit';
import { render } from '../../test_config/render';
import { screen } from '@testing-library/react';

jest.mock(
  '../../components/shared/AuthWrapper',
  () =>
    function MockAuthWrapper({
      role,
      children,
    }: {
      role: string;
      children: any;
    }) {
      return <div data-testid={`auth=${role}`}>{children}</div>;
    }
);
jest.mock(
  '../../components/speciesInformation/speciesInformationEditor',
  () =>
    function MockSpeciesInformationEditor() {
      return <div data-testid={'species_information_form'}>editor</div>;
    }
);

describe('species information edit page', () => {
  it('is wrapped in the correct AuthWrapper', () => {
    render(<SpeciesInformationEditorPage />);

    expect(screen.getByTestId('auth=editor')).toBeInTheDocument();
    expect(screen.getByTestId('species_information_form')).toBeInTheDocument();
  });
});