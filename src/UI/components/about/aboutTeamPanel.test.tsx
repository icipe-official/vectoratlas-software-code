import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutTeamPanel from './aboutTeamPanel';
import { team } from './data/team';

describe(AboutTeamPanel.name, () => {
  it('renders team member panel correctly for each entry', () => {
    const teamMembers = team.teamList;
    for (let i = 0; i < teamMembers.length; i++) {
      const teamMember = teamMembers[i];
      let memberId = teamMember.id;
      let memberName = teamMember.name;
      let location = teamMember.location;
      let position = teamMember.position;
      let imageURL = teamMember.imageURL;
      render(<AboutTeamPanel id={memberId} name={memberName} location={location} position={position} imageURL={imageURL} />);
      expect(screen.getByText(memberName)).toBeVisible();
      expect(screen.getByText(location)).toBeVisible();
      expect(screen.getByText(position)).toBeVisible();
      const profilePic = screen.getByTestId(`profileImage_${memberId}`).children[0]; //Return object of children. Only one child so simply index
      expect(profilePic).toHaveAttribute('src', imageURL);
      expect(profilePic).toHaveAttribute('alt', memberName);
    }
  });
});
