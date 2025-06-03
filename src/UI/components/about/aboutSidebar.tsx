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
import { useTranslations } from 'next-intl';

function AboutSidebar() {
  const t = useTranslations('AboutPage');

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
            marginTop: 13,
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
                {isMatch ? <InfoIcon /> : t('sectionHeaders.about')}{' '}
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
                {isMatch ? <GroupsIcon /> : t('sectionHeaders.team')}
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
                {isMatch ? <MailIcon /> : t('sectionHeaders.contact')}
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
                {isMatch ? (
                  <HandshakeOutlinedIcon />
                ) : (
                  t('sectionHeaders.partners')
                )}
              </Link>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default AboutSidebar;
