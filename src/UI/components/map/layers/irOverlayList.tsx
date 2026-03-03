import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';

import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { getWMTSOverlays } from '../../../state/map/actions/getWmtsoverlays';
import { toggleWMTSLayerVisibility } from '../../../state/map/mapSlice';

interface IROverlayListProps {
  sectionTitle?: string;
  sectionFlag: string;
}

export const IROverlayList: React.FC<IROverlayListProps> = ({
  sectionTitle = 'Insecticide Resistence Overlays',
  sectionFlag,
}) => {
  const dispatch = useAppDispatch();
  const [sectionOpen, setSectionOpen] = useState(false);

  const drawerOpen = useAppSelector((s) => s.map.map_drawer.open);
  const wmtsLayers = useAppSelector((s) => s.map.wmtsLayers);
  const wmtsStatus = useAppSelector((s) => s.map.wmtsStatus);

  // Lazy-load: only fetch when the section is first opened
  useEffect(() => {
    if (sectionOpen && wmtsStatus === 'idle') {
      dispatch(getWMTSOverlays());
    }
  }, [sectionOpen, wmtsStatus, dispatch]);

  return (
    <>
      {/* ── Section header ── */}
      <ListItemButton
        onClick={() => setSectionOpen((prev) => !prev)}
        data-testid={`${sectionFlag}Toggle`}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <LayersIcon fontSize="small" />
        </ListItemIcon>

        {drawerOpen && (
          <ListItemText
            primary={sectionTitle}
            primaryTypographyProps={{ fontWeight: 600, fontSize: 13 }}
          />
        )}

        {drawerOpen && (sectionOpen ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>

      {/* ── Collapsible layer list ── */}
      <Collapse in={sectionOpen && drawerOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          {/* Loading */}
          {wmtsStatus === 'loading' && (
            <ListItemButton disabled sx={{ pl: 4 }}>
              <CircularProgress size={14} sx={{ mr: 1 }} />
              <ListItemText
                primary="Loading layers…"
                primaryTypographyProps={{ fontSize: 12 }}
              />
            </ListItemButton>
          )}

          {/* Error — click to retry */}
          {wmtsStatus === 'failed' && (
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => dispatch(getWMTSOverlays())}
            >
              <ListItemText
                primary="Failed to load — click to retry"
                primaryTypographyProps={{ fontSize: 12, color: 'error.main' }}
              />
            </ListItemButton>
          )}

          {/* Empty */}
          {wmtsStatus === 'succeeded' && wmtsLayers.length === 0 && (
            <ListItemButton disabled sx={{ pl: 4 }}>
              <ListItemText
                primary="No layers found"
                primaryTypographyProps={{ fontSize: 12 }}
                sx={{ color: 'GrayText' }}
              />
            </ListItemButton>
          )}

          {/* Layer rows */}
          {wmtsLayers.map((layer: any) => (
            <Tooltip
              key={layer.name}
              title={layer.abstract ?? layer.name}
              placement="right"
              arrow
            >
              <ListItemButton
                sx={{ pl: 3 }}
                onClick={() => dispatch(toggleWMTSLayerVisibility(layer.name))}
                data-testid={`wmtsLayer_${layer.name}`}
              >
                <Checkbox
                  checked={layer.isVisible}
                  size="small"
                  style={{ width: 10, height: 10 }}
                  data-testid={`${layer.name}Checkbox`}
                />
                <ListItemText
                  primary={layer.title || layer.name}
                  primaryTypographyProps={{ fontSize: 12 }}
                  sx={{ color: 'GrayText', ml: 1 }}
                />
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default IROverlayList;
