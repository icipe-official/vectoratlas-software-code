import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import GroupsIcon from '@mui/icons-material/Groups';
import MailIcon from '@mui/icons-material/Mail';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import { Link } from 'react-scroll';

function AboutSidebar() {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

  const green = '#2e7d32';

  const navItems = [
    { label: 'About', icon: <InfoIcon sx={{ color: green }} fontSize="small" />, to: 'About' },
    { label: 'The Team', icon: <GroupsIcon sx={{ color: green }} fontSize="small" />, to: 'The Team' },
    { label: 'Contact', icon: <MailIcon sx={{ color: green }} fontSize="small" />, to: 'Contact Us' },
    { label: 'Partners', icon: <HandshakeOutlinedIcon sx={{ color: green }} fontSize="small" />, to: 'Our Partners' },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          top: 83, // Full top positioning
          width: isMatch ? 50 : 80,
          bgcolor: '#f5f5f5',
          opacity: 0.95,
          height: '100vh', // Full height like a drawer
          position: 'fixed',
          borderRight: '1px solid #ddd',
          display: isMatch ? 'none' : 'flex',
          alignItems: 'center',
          px: 2,
          py: 2,
        },
      }}
    >
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          gap: 2,
        }}
      >
        {navItems.map((item) => (
          <Link
            to={item.to}
            smooth={true}
            duration={500}
            offset={-100}
            key={item.label}
            style={{ textDecoration: 'none', width: '100%' }}
          >
            <ListItem disablePadding sx={{ justifyContent: 'center' }}>
              <ListItemButton
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  py: 1,
                  '&:hover': {
                    bgcolor: 'primary.light',
                    borderRadius: 1,
                  },
                }}
              >
                {item.icon}
                {!isMatch && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: green,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}

export default AboutSidebar;
