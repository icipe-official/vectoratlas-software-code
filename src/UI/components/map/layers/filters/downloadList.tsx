import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../state/hooks';
import { drawerListToggle, drawerToggle } from '../../../../state/map/mapSlice';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadMap from './downloadMap';


export const DownloadList = ({
    sectionTitle,
    sectionFlag,
}: {
    sectionTitle: string;
    sectionFlag: string;
}) => {
    const dispatch = useDispatch();
    const open  = useAppSelector((state) => state.map.map_drawer.open);
    const openDownloadPanel = useAppSelector((state) => state.map.map_drawer.download);

    const handleClick = () => {
        if (open === true) {
          dispatch(drawerListToggle(sectionFlag));
        } else {
          dispatch(drawerToggle());
          dispatch(drawerListToggle(sectionFlag));
        }
      };
      return (
        <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
            data-testid={`${sectionFlag}Button`}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
            onClick={handleClick}
            >
              <ListItemIcon
                sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                 }}
              >
                <DownloadIcon />
                </ListItemIcon>  
                <ListItemText primary={sectionTitle} sx={{ opacity: open ? 1 : 0 }} />
                {openDownloadPanel && open ? <ExpandLess /> : null}
                {!openDownloadPanel && open ? <ExpandMore /> : null}
    
            </ListItemButton>
            <Collapse
                data-testid={`${sectionFlag}ListContainer`}
                in={openDownloadPanel}
                timeout="auto"
                unmountOnExit
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingX: 2,
                  paddingBottom: 2,
                  width: '100%',
                }}
                >

              <DownloadMap />
            
            </Collapse>
    
        </ListItem>
    );
};

export default DownloadList;