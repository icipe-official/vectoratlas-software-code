import React from 'react';
import { render } from '@testing-library/react';
import { screen, within } from '@testing-library/dom';
import AboutTeamPanel from './aboutTeamPanel';
import data from './data/team-en.json';

describe(AboutTeamPanel.name, () => {
  it('renders team member panel correctly for each entry', () => {
    const teamMembers = data.teamList;
    for (let i = 0; i < teamMembers.length; i++) {
      const teamMember = teamMembers[i];
      const memberId = teamMember.id;
      const memberName = teamMember.name;
      const location = teamMember.location;
      const imageURL = teamMember.imageURL;
      const description = teamMember.description;

      render(
        <AboutTeamPanel
          id={memberId}
          name={memberName}
          location={location}
          position=""
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
        .children[0];
      expect(profilePic).toHaveAttribute('src', imageURL);
      expect(profilePic).toHaveAttribute('alt', memberName);
    }
  });
});
// olp;.l.,l
