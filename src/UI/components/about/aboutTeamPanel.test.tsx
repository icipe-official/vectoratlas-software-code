import React from 'react';
import { render } from '@testing-library/react';
import { screen, within } from '@testing-library/dom';
import AboutTeamPanel from './aboutTeamPanel';
import data from './data/team.json';

describe(AboutTeamPanel.name, () => {
  it('renders team member panel correctly for each entry', () => {
    const teamMembers = data.teamList;
    for (let i = 0; i < teamMembers.length; i++) {
      const teamMember = teamMembers[i];
      let memberId = teamMember.id;
      let memberName = teamMember.name;
      let location = teamMember.location;
      let position = teamMember.position;
      let imageURL = teamMember.imageURL;
      let description = teamMember.description;
      render(
        <AboutTeamPanel
          id={memberId}
          name={memberName}
          location={location}
          position={position}
          imageURL={imageURL}
          description={description}
        />
      );
      const teamMemberPanel = screen.getByTestId(
        `teamMemberContainer_${memberId}`
      );
      expect(within(teamMemberPanel).getByText(memberName)).toBeVisible();
      expect(within(teamMemberPanel).getByText(location)).toBeVisible();
      const profilePic = screen.getByTestId(`profileImage_${memberId}`)
        .children[0]; //Return object of children. Only one child so simply index
      expect(profilePic).toHaveAttribute('src', imageURL);
      expect(profilePic).toHaveAttribute('alt', memberName);
    }
  });
});
