import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  IconButton,
  List,
  ListItemButton,
  Typography,
  Collapse,
  CircularProgress,
  Checkbox
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';
import { toggleWMTSLayerVisibility } from '../../../state/map/mapSlice';
import { getWMTSOverlays } from '../../../state/map/actions/getWmtsoverlays';

export const IROverlaysPanel = () => {
  const dispatch = useAppDispatch();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [isMinimized, setIsMinimized] = useState(false);

  const open = useAppSelector((s) => s.map.map_drawer.ir_overlays);
  const wmtsLayers = useAppSelector((s) => s.map.wmtsLayers);
  const wmtsStatus = useAppSelector((s) => s.map.wmtsStatus);

  useEffect(() => {
    if (open && wmtsStatus === 'idle') {
      dispatch(getWMTSOverlays());
    }
  }, [open, wmtsStatus, dispatch]);

  const grouped = wmtsLayers.reduce<Record<string, any[]>>((acc, layer) => {
    const groupKey = layer.name.includes('_ir_')
      ? layer.name.split('_ir_')[0]
      : layer.name.split('_')[0];

    acc[groupKey] = acc[groupKey] || [];
    acc[groupKey].push(layer);
    return acc;
  }, {});

  const toggleGroup = (group: string) =>
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  if (!open) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'absolute',
        top: 24,
        left: 24,
        width: 420,
        maxHeight: isMinimized ? 'fit-content' : '85vh',
        zIndex: 20,
        backdropFilter: 'blur(16px) saturate(180%)',
        background: 'rgba(15, 23, 42, 0.85)',
        color: '#f8fafc',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* HEADER - COLLAPSIBLE ONLY */}
      <Box
        onClick={() => setIsMinimized(!isMinimized)}
        sx={{
          px: 3,
          py: 2.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.03)',
          '&:hover': { background: 'rgba(255, 255, 255, 0.06)' },
          borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LayersIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 10,
              color: '#38bdf8',
            }}
          >
            Insecticide Resistance Overlays
          </Typography>
        </Box>

        <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          {isMinimized ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Box>

      {/* MAIN CONTENT AREA */}
      <Collapse in={!isMinimized} timeout="auto">
        <Box
          sx={{
            px: 2,
            py: 2,
            overflowY: 'auto',
            maxHeight: '70vh',
            '&::-webkit-scrollbar': { width: 5 },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
            },
          }}
        >
          {wmtsStatus === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={28} thickness={5} sx={{ color: '#38bdf8' }} />
            </Box>
          )}

          {Object.entries(grouped).map(([groupName, layers]) => {
            const isExpanded = !!expandedGroups[groupName];
            const activeCount = layers.filter(l => l.isVisible).length;

            return (
              <Box key={groupName} sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => toggleGroup(groupName)}
                  sx={{
                    borderRadius: '16px',
                    px: 2,
                    py: 1.5,
                    background: isExpanded ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      flexGrow: 1,
                      fontWeight: 700,
                      fontSize: 14,
                      color: activeCount > 0 ? '#38bdf8' : 'inherit'
                    }}
                  >
                    {groupName.replace(/-/g, ' ')}
                  </Typography>

                  {isExpanded ? <ExpandLess sx={{ opacity: 0.5 }} /> : <ExpandMore sx={{ opacity: 0.5 }} />}
                </ListItemButton>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List dense disablePadding sx={{ mt: 0.5, mb: 1 }}>
                    {layers.map((layer) => {
                      const active = layer.isVisible;
                      const displayLabel = layer.title || layer.name.replace(`${groupName}_ir_`, '').replace(/_/g, ' ');

                      return (
                        <ListItemButton
                          key={layer.name}
                          onClick={() => dispatch(toggleWMTSLayerVisibility(layer.name))}
                          sx={{
                            ml: 1.5,
                            mr: 1,
                            borderRadius: '12px',
                            py: 0.2,
                            mb: 0.5,
                            background: active ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                            '&:hover': { background: 'rgba(255, 255, 255, 0.03)' },
                          }}
                        >
                          <Checkbox
                            checked={active}
                            size="small"
                            disableRipple
                            sx={{
                              p: 1,
                              color: 'rgba(255, 255, 255, 0.2)',
                              '&.Mui-checked': {
                                color: '#38bdf8',
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 13,
                              fontWeight: active ? 600 : 400,
                              color: active ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                            }}
                          >
                            {displayLabel}
                          </Typography>
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Paper>
  );
};