import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutTeam from './aboutTeam';
import { team } from './data/team';

describe(AboutTeam.name, () => {
  it('renders the correct number of team panels', () => {
    const teamMembers = team.teamList;
    render(<AboutTeam />);
    const numRenderedMembers = screen.getByTestId('teamListContainer').children.length;
    expect(numRenderedMembers == teamMembers.length);
  });
});
