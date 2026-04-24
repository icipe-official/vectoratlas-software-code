import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import {
  List,
  Drawer,
  Divider,
  IconButton,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LayersIcon from '@mui/icons-material/Layers';

import { DrawerList } from './drawerList';
import { drawerToggle, drawerListToggle } from '../../../state/map/mapSlice';
import { FilterList } from './filters/filterList';
import DownloadList from './filters/downloadList';

export default function DrawerMap() {
  const t = useTranslations('MapPage');
  const theme = useTheme();
  const dispatch = useDispatch();
  const drawerWidth = 370;

  // const overlays = useAppSelector((state) =>
  //   state.map.map_overlays.filter((l: any) => l.sourceLayer !== 'world')
  // );
  const baseMap = useAppSelector((state) =>
    state.map.map_overlays.filter((l: any) => l.sourceLayer === 'world')
  );
  const open = useAppSelector((state) => state.map.map_drawer.open);

  const overlaysPopupOpen = useAppSelector(
    (state) => state.map.map_drawer.overlays
  );

  const irPopupOpen = useAppSelector(
    (state) => state.map.map_drawer.ir_overlays
  );

  const openedMixin = (theme: any) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    height: 'calc(100vh - 230px)',
  });

  const closedMixin = (theme: any) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    height: 'calc(100vh - 230px)',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: { width: `calc(${theme.spacing(8)} + 1px)` },
  });

  return (
    <Drawer
      sx={{
        // width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open
          ? { ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme) }
          : {
              ...closedMixin(theme),
              '& .MuiDrawer-paper': closedMixin(theme),
            }),
      }}
      PaperProps={{ sx: { position: 'inherit' } }}
      variant="permanent"
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-end' : 'center',
          px: 1,
          ...theme.mixins.toolbar,
        }}
      >
        <IconButton onClick={() => dispatch(drawerToggle())}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <List sx={{ px: open ? 1 : 0 }}>
        <Divider />
        <FilterList
          sectionTitle={t('drawerMap.filtersTitle')}
          sectionFlag="filters"
        />
        <Divider />
        {/* <DrawerList
          sectionTitle={t('drawerMap.overlaysTitle')}
          overlays={overlays}
          sectionFlag="overlays"
        /> */}

        <ListItemButton
          onClick={() => {
            if (!overlaysPopupOpen) dispatch(drawerListToggle('overlays'));
          }}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            my: 0.5,
            borderRadius: '12px',
            backgroundColor: overlaysPopupOpen
              ? 'rgba(56, 189, 248, 0.1)'
              : 'transparent',
            color: overlaysPopupOpen ? '#323435' : 'inherit',
            '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.05)' },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              // Uses the same dark grey for both states to stay uniform
              color: 'rgba(0, 0, 0, 0.54)',
            }}
          >
            <LayersIcon />
          </ListItemIcon>

          {open && (
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                  {t('drawerMap.overlaysTitle')}
                </Typography>
              }
            />
          )}
        </ListItemButton>

        <Divider />

        <ListItemButton
          onClick={() => {
            if (!irPopupOpen) dispatch(drawerListToggle('ir_overlays'));
          }}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            my: 0.5,
            borderRadius: '12px',
            backgroundColor: irPopupOpen
              ? 'rgba(56, 189, 248, 0.1)'
              : 'transparent',
            color: irPopupOpen ? '#323435' : 'inherit',
            '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.05)' },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              // Uses the same dark grey for both states to stay uniform
              color: 'rgba(0, 0, 0, 0.54)',
            }}
          >
            <LayersIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                  {t('drawerMap.iroverlaysTitle')}
                </Typography>
              }
            />
          )}
        </ListItemButton>

        <Divider />
        <DrawerList
          sectionTitle={t('drawerMap.baseMapTitle')}
          overlays={baseMap}
          sectionFlag="baseMap"
        />
        <Divider />
        <DownloadList
          sectionTitle={t('drawerMap.downloadTitle')}
          sectionFlag="download"
        />
        <Divider />
      </List>
    </Drawer>
  );
}
