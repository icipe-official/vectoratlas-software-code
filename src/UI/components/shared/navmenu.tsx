import { Button, Menu, MenuItem, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useState } from 'react';
import NavLink from './navlink';

export default function NavMenu({ text, options }: { text: string, options: { text: string, url: string }[] }) {
  const theme = useTheme();
  const baseStyle = {
    padding: '8px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      borderRadius: '40%',
    },
  };
  const buttonStyle = {
    '&:hover': {backgroundColor: 'transparent'},
    margin: 0,
    padding: 0
  }
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <><Button id="basic-button" sx={buttonStyle} onClick={handleClick}>
      <Typography
        data-testid={'navlink ' + text}
        variant="h5"
        component="div"
        color="primary"
        sx={baseStyle}
      >
        {text}
      </Typography></Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': "basic-button",
        }}
      >
        {options.map((option) => (
          <MenuItem sx={{ ...buttonStyle, padding: 2 }} onClick={handleClose}>
            <NavLink text={option.text} url={option.url} />
          </MenuItem>
        ))
        }
      </Menu>
    </>
  );
}
