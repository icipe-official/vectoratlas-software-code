import React from 'react';
import { useDispatch, shallowEqual } from 'react-redux';
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
  useMediaQuery,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LayersIcon from '@mui/icons-material/Layers';

import { DrawerList } from './drawerList';
import { drawerToggle, drawerListToggle } from '../../../state/map/mapSlice';
import { FilterList } from './filters/filterList';
import DownloadList from './filters/downloadList';

import DockPanel from '../../../components/mobileDock/DockPanel';

export default function DrawerMap() {
  const t = useTranslations('MapPage');
  const theme = useTheme();
  const dispatch = useDispatch();
  const drawerWidth = 370;

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // shallowEqual compares the array's items, so this selector doesn't
  // trigger a re-render on every store update.
  const baseMap = useAppSelector(
    (state) =>
      state.map.map_overlays.filter((l: any) => l.sourceLayer === 'world'),
    shallowEqual
  );
  const open = useAppSelector((state) => state.map.map_drawer.open);

  const overlaysPopupOpen = useAppSelector(
    (state) => state.map.map_drawer.overlays
  );

  const irPopupOpen = useAppSelector(
    (state) => state.map.map_drawer.ir_overlays
  );

  // On mobile the menu is always in the dock, so its labels always show.
  // On desktop this is the same as the Redux open flag.
  const expanded = isMobile || open;

  const openedMixin = (theme: any) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: 'hidden',
    height: '100%',
    margin: '0px',
  });

  const closedMixin = (theme: any) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflow: 'hidden',
    height: '100%',
    width: `calc(${theme.spacing(8)} + 1px)`,
    margin: '0px',
  });

  // Shared content for both desktop and mobile
  const drawerContent = (
    <>
      {/* Desktop only: the mobile dock panel has its own minimize button */}
      {!isMobile && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-end' : 'center',
            ...theme.mixins.toolbar,
          }}
        >
          <IconButton onClick={() => dispatch(drawerToggle())}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      )}

      <List
        // On phones the list sizes to its content. On desktop it fills the
        // drawer and scrolls, as before.
        sx={{
          overflowX: 'hidden',
          overflowY: isMobile ? 'visible' : 'auto',
          flex: isMobile ? '0 0 auto' : 1,
          minHeight: 0,
          py: 0,
        }}
      >
        <Divider />
        <FilterList
          sectionTitle={t('drawerMap.filtersTitle')}
          sectionFlag="filters"
        />
        <Divider />

        <ListItemButton
          onClick={() => {
            dispatch(drawerListToggle('overlays'));
          }}
          sx={{
            minHeight: 48,
            justifyContent: expanded ? 'initial' : 'center',
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
              mr: expanded ? 3 : 'auto',
              justifyContent: 'center',
              color: 'rgba(0, 0, 0, 0.54)',
            }}
          >
            <LayersIcon />
          </ListItemIcon>

          {expanded && (
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
            dispatch(drawerListToggle('ir_overlays'));
          }}
          sx={{
            minHeight: 48,
            justifyContent: expanded ? 'initial' : 'center',
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
              mr: expanded ? 3 : 'auto',
              justifyContent: 'center',
              color: 'rgba(0, 0, 0, 0.54)',
            }}
          >
            <LayersIcon />
          </ListItemIcon>
          {expanded && (
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
    </>
  );

  // Mobile: the menu is always registered in the dock. The bar decides
  // whether it is showing or minimized. It has no close button, so it
  // can't be removed by accident. Its title text is hidden; the dock
  // icon still shows "Menu".
  if (isMobile) {
    return (
      <DockPanel
        id="menu"
        title="Menu"
        icon={MenuIcon}
        open
        showTitle={false}
        // Sized to its content, not the full map height
        card={false}
      >
        <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
          {drawerContent}
        </Box>
      </DockPanel>
    );
  }

  // Desktop: the original permanent sidebar
  return (
    <Drawer
      sx={{
        position: 'relative',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        zIndex: 1,
        ...(open
          ? { ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme) }
          : {
              ...closedMixin(theme),
              '& .MuiDrawer-paper': closedMixin(theme),
            }),
      }}
      PaperProps={{
        sx: {
          position: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        },
      }}
      variant="permanent"
      open={open}
    >
      {drawerContent}
    </Drawer>
  );
}
