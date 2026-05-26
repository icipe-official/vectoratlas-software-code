import {
  Button,
  Menu,
  MenuItem,
  useTheme,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import NavLink from './navlink';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Professional visual cue

export default function NavMenu({
  text,
  options,
}: {
  text: string;
  options: { text: string; url: string; icon?: React.ReactNode }[]; // Added icon support
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Modern Navigation Style
  const navButtonStyle = {
    padding: '6px 12px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1.5rem',
    borderRadius: '8px', // More modern than 40%
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(0, 133, 63, 0.08)', // Soft Vector Atlas Green tint
      color: theme.palette.primary.main,
    },
  };

  return (
    <>
      <Button
        sx={navButtonStyle}
        onClick={handleClick}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transition: '0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0)',
            }}
          />
        }
      >
        {text}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // Customizing the "Paper" (the actual container)
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 220,
            overflow: 'visible',
            filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
            mt: 1.5,
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.05)',
            '&:before': {
              // Small arrow pointing up
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 24,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option.text}
            onClick={handleClose}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': { backgroundColor: '#f9fafb' },
            }}
          >
            {/* NavLink wrap usually handles the click/navigation */}
            <NavLink text={option.text} url={option.url} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
