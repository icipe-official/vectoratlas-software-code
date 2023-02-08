import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutTeam from './aboutTeam';
import data from './data/team.json';
import { renderWithUser } from '../../test_config/render';
import { act, fireEvent } from '@testing-library/react';

describe(AboutTeam.name, () => {
  it('renders the correct number of team panels', () => {
    const teamMembers = data.teamList;
    render(<AboutTeam />);
    const numRenderedMembers =
      screen.getByTestId('teamListContainer').children.length;
    expect(numRenderedMembers == teamMembers.length);
  });

  it('Opens a div when avatar is clicked', async () => {
    await act(async () => {
      renderWithUser(<AboutTeam />);
    });
    const openBox = screen.getByTestId('openMember');

    fireEvent.click(openBox);
    const memberBox = screen.getByTestId('teamMemberBox');
    expect(memberBox).toBeInTheDocument();
  });
});
