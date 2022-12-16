import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import { drawerToggle, setSelectedIds } from '../../../state/map/mapSlice';
import DetailedData from './detailedData';

export default function DataDrawer(): JSX.Element {
  const theme = useTheme();
  const dispatch = useDispatch();
  const drawerWidth = 370;

  const handleDrawer = () => {
    dispatch(setSelectedIds([]));
  };

  const data = useAppSelector((state) => state.map.selectedData);

  const openedMixin = (theme: any) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    margin: '0px',
    height: 'calc(100vh - 230px)',
  });

  const drawerHeaderSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  };

  const drawerSx = {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  };

  return (
    <Drawer
      sx={drawerSx}
      PaperProps={{ sx: { position: 'inherit' } }}
      variant="permanent"
      open={true}
      data-testid="drawer"
    >
      <Box sx={drawerHeaderSx}>
        <IconButton data-testid="drawerToggle" onClick={handleDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {data.map((singleRow) => (
          <React.Fragment key={singleRow.id}>
            <Divider />
            <DetailedData data={singleRow} />
          </React.Fragment>
        ))}
        <Divider />
      </List>
    </Drawer>
  );
}
