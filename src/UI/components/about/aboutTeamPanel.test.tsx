import React from 'react'; // or change tsconfig compilerOptions to 'jsx':'react-jsx'
import { render } from '@testing-library/react';
import {screen } from '@testing-library/dom';
import AboutTeamPanel from './aboutTeamPanel';
import {dummyTeam} from './dummyState';
describe(AboutTeamPanel.name, () => {
  
  it('renders team member panel correctly for each entry', () => {
    const team = dummyTeam.team;
    for (let i =0; i < team.length; i++){
      const teamMember = team[i];
      let memberId = teamMember.id;
      let memberName=teamMember.name;
      let location=teamMember.location;
      let position=teamMember.position;
      let imageURL=teamMember.imageURL;
      render(<AboutTeamPanel id={memberId} name={memberName} location={location} position={position} imageURL={imageURL}/>);
      expect(screen.getByText(memberName)).toBeVisible();
      expect(screen.getByText(location)).toBeVisible();
      expect(screen.getByText(position)).toBeVisible();
      const profilePic = screen.getByTestId(`profileImage_${memberId}`).children[0]; //Return object of children. Only one child so simply index
      expect(profilePic).toHaveAttribute('src', imageURL);
      expect(profilePic).toHaveAttribute('alt', memberName);
    }
  });
});
