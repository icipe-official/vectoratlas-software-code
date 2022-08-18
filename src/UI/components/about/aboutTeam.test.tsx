import React from 'react'; // or change tsconfig compilerOptions to 'jsx':'react-jsx'
import { render } from '@testing-library/react';
import {screen } from '@testing-library/dom';
import AboutTeam from './aboutTeam';
import {dummyTeam} from './dummyState';
describe(AboutTeam.name, () => {
  it('renders the correct number of team panels', () => {
    const team = dummyTeam.team;
    render(<AboutTeam />);
    const numRenderedMembers = screen.getByTestId('teamListContainer').children.length; //Return object of children. Only one child so simply index
    expect(numRenderedMembers == team.length);
  });
});
