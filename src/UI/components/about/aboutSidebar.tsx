import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import GroupsIcon from '@mui/icons-material/Groups';
import CallIcon from '@mui/icons-material/Call';
import MailIcon from '@mui/icons-material/Mail';

import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import { Link } from 'react-scroll';
import { useMediaQuery, useTheme } from '@mui/material';

function AboutSidebar() {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <Drawer
        data-testid="drawercomponent"
        anchor="top"
        variant="permanent"
        PaperProps={{
          sx: {
            height: isMatch ? 220 : 170,
            lineHeight: 0.5,
            width: isMatch ? 30 : 100,
            opacity: 0.7,
            margin: 0,
            padding: 0,
            fontWeight: 'bold',
            marginTop: 10,
          },
        }}
      >
        <List data-testid="listitem">
          <ListItem alignItems="flex-start" disablePadding>
            <ListItemButton disableGutters>
              <Link
                to="About"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                {isMatch ? <InfoIcon /> : 'About'}{' '}
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton disableGutters>
              <Link
                to="The Team"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                {isMatch ? <GroupsIcon /> : 'The Team'}
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton disableGutters>
              <Link
                to="Contact Us"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                {isMatch ? <MailIcon /> : 'Contact'}
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton disableGutters>
              <Link
                to="Our Patners"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                {isMatch ? <HandshakeOutlinedIcon /> : 'Partners'}
              </Link>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default AboutSidebar;
