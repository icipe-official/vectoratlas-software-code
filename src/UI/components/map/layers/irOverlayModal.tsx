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
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';
import {
  toggleWMTSLayerVisibility,
  drawerListToggle,
} from '../../../state/map/mapSlice';
import { getWMTSOverlays } from '../../../state/map/actions/getWmtsoverlays';

export const IROverlaysPanel = () => {
  const dispatch = useAppDispatch();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [isMinimized, setIsMinimized] = useState(false);

  const open = useAppSelector((s) => s.map.map_drawer.ir_overlays);
  const wmtsLayers = useAppSelector((s) => s.map.wmtsLayers);
  const wmtsStatus = useAppSelector((s) => s.map.wmtsStatus);

  useEffect(() => {
    if (open && wmtsStatus === 'idle') {
      dispatch(getWMTSOverlays());
    }
  }, [open, wmtsStatus, dispatch]);

  if (!open) return null;

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

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        top: 140,
        left: 400,
        width: 380,
        maxHeight: isMinimized ? 'fit-content' : 'calc(100vh - 48px)',
        zIndex: 1200,
        backdropFilter: 'blur(16px) saturate(180%)',
        background: 'rgba(15, 23, 42, 0.9)', // Deep slate translucent
        color: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {/* PROFESSIONAL HEADER */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isMinimized
            ? 'none'
            : '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
          }}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <Box
            sx={{
              p: 0.8,
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
            }}
          >
            <LayersIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                lineHeight: 1,
                fontWeight: 700,
                color: '#38bdf8',
                mb: 0.5,
              }}
            >
              Insecticide Resistance Overlays
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => setIsMinimized(!isMinimized)}
            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            {isMinimized ? (
              <ExpandMore fontSize="small" />
            ) : (
              <ExpandLess fontSize="small" />
            )}
          </IconButton>
          <IconButton
            size="small"
            onClick={() => dispatch(drawerListToggle('ir_overlays'))}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                color: '#38bdf8',
                background: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* SCROLLABLE CONTENT */}
      <Collapse
        in={!isMinimized}
        timeout="auto"
        sx={{ flexGrow: 1, overflow: 'hidden' }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1.5,
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
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={20} sx={{ color: '#38bdf8' }} />
            </Box>
          )}

          {Object.entries(grouped).map(([groupName, layers]) => {
            const isGroupExpanded = !!expandedGroups[groupName];
            const activeCount = layers.filter((l) => l.isVisible).length;

            return (
              <Box key={groupName} sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => toggleGroup(groupName)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 1.5,
                    transition: '0.2s',
                    background: isGroupExpanded
                      ? 'rgba(255, 255, 255, 0.03)'
                      : 'transparent',
                    '&:hover': { background: 'rgba(255, 255, 255, 0.06)' },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      flexGrow: 1,
                      fontWeight: isGroupExpanded ? 600 : 400,
                      color: activeCount > 0 ? '#38bdf8' : '#cbd5e1',
                    }}
                  >
                    {groupName.replace(/-/g, ' ')}
                  </Typography>
                  {activeCount > 0 && !isGroupExpanded && (
                    <Typography
                      variant="caption"
                      sx={{
                        mr: 1,
                        px: 0.8,
                        py: 0.1,
                        borderRadius: '4px',
                        background: '#38bdf8',
                        color: '#0f172a',
                        fontWeight: 700,
                      }}
                    >
                      {activeCount}
                    </Typography>
                  )}
                  {isGroupExpanded ? (
                    <ExpandLess sx={{ fontSize: 18, opacity: 0.5 }} />
                  ) : (
                    <ExpandMore sx={{ fontSize: 18, opacity: 0.5 }} />
                  )}
                </ListItemButton>

                <Collapse in={isGroupExpanded} timeout="auto" unmountOnExit>
                  <List dense disablePadding sx={{ py: 0.5 }}>
                    {layers.map((layer) => (
                      <ListItemButton
                        key={layer.name}
                        onClick={() =>
                          dispatch(toggleWMTSLayerVisibility(layer.name))
                        }
                        sx={{
                          ml: 2,
                          borderRadius: '8px',
                          py: 0.4,
                          mb: 0.2,
                          '&:hover': { background: 'rgba(56, 189, 248, 0.05)' },
                        }}
                      >
                        <Checkbox
                          checked={layer.isVisible}
                          disableRipple
                          size="small"
                          sx={{
                            color: '#fff',
                            '&.Mui-checked': { color: '#38bdf8' },
                            p: 0.5,
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.8rem',
                            color: layer.isVisible ? '#fff' : '#fffffff',
                            fontWeight: layer.isVisible ? 500 : 400,
                          }}
                        >
                          {layer.title ||
                            layer.name
                              .replace(`${groupName}_ir_`, '')
                              .replace(/_/g, ' ')}
                        </Typography>
                      </ListItemButton>
                    ))}
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
