import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItemButton,
  Typography,
  Divider,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import { drawerListToggle } from '../../../state/map/mapSlice';
import { LayerControl } from './layerControl';

export const IROverlaysDialog = () => {
  const dispatch = useDispatch();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const open = useAppSelector((s) => s.map.map_drawer.ir_overlays);
  const overlays = useAppSelector((s) =>
    s.map.map_overlays.filter((o) => o.sourceType === 'external-wms')
  );

  const grouped = overlays.reduce<Record<string, any[]>>((acc, o) => {
    const key = o.layerGroup ?? 'Other';
    acc[key] = acc[key] || [];
    acc[key].push(o);
    return acc;
  }, {});

  const toggleGroup = (group: string) =>
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(drawerListToggle('irOverlays'))}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Insecticide Resistance Overlays
        <IconButton
          onClick={() => dispatch(drawerListToggle('irOverlays'))}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {Object.keys(grouped).length === 0 && (
          <Typography color="text.secondary">
            No IR overlays available
          </Typography>
        )}

        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([group, layers]) => (
            <div key={group}>
              <ListItemButton onClick={() => toggleGroup(group)} sx={{ px: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ flexGrow: 1, fontWeight: 600 }}
                >
                  {group} ({layers.length})
                </Typography>
                {expandedGroups[group] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Divider sx={{ mb: 1 }} />

              <Collapse
                in={!!expandedGroups[group]}
                timeout="auto"
                unmountOnExit
              >
                <List dense>
                  {layers.map((overlay) => (
                    <LayerControl
                      key={overlay.name}
                      name={overlay.name}
                      displayName={overlay.displayName}
                      isVisible={overlay.isVisible}
                      blobLocation={overlay.blobLocation}
                      externalLink={overlay.externalLink}
                    />
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
};
