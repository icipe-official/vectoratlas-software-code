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

  // Changed to string | null to handle accordion behavior
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
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

  // Accordion Logic: Closes previous when next is opened
  const toggleGroup = (group: string) => {
    setExpandedGroup((prev) => (prev === group ? null : group));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'absolute',
        top: 108,
        left: 380,
        width: 340, // Keeping your width
        maxHeight: isMinimized ? 'fit-content' : 'calc(100vh - 48px)', // Keeping your height logic
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

        // Glassmorphism Look
        backdropFilter: 'blur(12px) saturate(160%)',
        background: 'rgba(15, 23, 42, 0.8)', // Professional deep slate translucency
        color: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)', // Subtle highlight border
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: isMinimized
            ? 'none'
            : '1px solid rgba(255, 255, 255, 0.08)',
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
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
            }}
          >
            <LayersIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
          </Box>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              color: '#38bdf8',
              letterSpacing: '0.5px',
              lineHeight: 1.2,
            }}
          >
            IR Overlays
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => setIsMinimized(!isMinimized)}
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              '&:hover': { color: '#fff' },
            }}
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
              color: 'rgba(255, 255, 255, 0.4)',
              '&:hover': {
                color: '#ef4444',
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
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
            },
          }}
        >
          {wmtsStatus === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={22} sx={{ color: '#38bdf8' }} />
            </Box>
          )}

          {Object.entries(grouped).map(([groupName, layers]) => {
            const isGroupExpanded = expandedGroup === groupName;
            const activeCount = layers.filter((l) => l.isVisible).length;

            return (
              <Box key={groupName} sx={{ mb: 0.8 }}>
                <ListItemButton
                  onClick={() => toggleGroup(groupName)}
                  sx={{
                    borderRadius: '12px',
                    py: 1.2,
                    px: 1.5,
                    transition: 'all 0.2s ease',
                    background: isGroupExpanded
                      ? 'rgba(56, 189, 248, 0.08)'
                      : 'transparent',
                    border: isGroupExpanded
                      ? '1px solid rgba(56, 189, 248, 0.2)'
                      : '1px solid transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.06)',
                      transform: 'translateX(4px)', // Interactive feel
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      flexGrow: 1,
                      fontWeight: isGroupExpanded ? 600 : 400,
                      color: activeCount > 0 ? '#38bdf8' : '#cbd5e1',
                      textTransform: 'capitalize',
                    }}
                  >
                    {groupName.replace(/-/g, ' ')}
                  </Typography>

                  {activeCount > 0 && !isGroupExpanded && (
                    <Box
                      sx={{
                        mr: 1,
                        px: 0.8,
                        py: 0.1,
                        borderRadius: '6px',
                        background: '#38bdf8',
                        color: '#0f172a',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                      }}
                    >
                      {activeCount}
                    </Box>
                  )}

                  {isGroupExpanded ? (
                    <ExpandLess sx={{ fontSize: 18, color: '#38bdf8' }} />
                  ) : (
                    <ExpandMore sx={{ fontSize: 18, opacity: 0.4 }} />
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
                          ml: 1,
                          borderRadius: '10px',
                          py: 0.6,
                          mb: 0.2,
                          '&:hover': { background: 'rgba(56, 189, 248, 0.05)' },
                        }}
                      >
                        <Checkbox
                          checked={layer.isVisible}
                          disableRipple
                          size="small"
                          sx={{
                            color: 'rgba(255,255,255,0.2)',
                            '&.Mui-checked': { color: '#38bdf8' },
                            p: 0.5,
                            mr: 1,
                          }}
                        />

                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.8rem',
                            color: layer.isVisible
                              ? '#fff'
                              : 'rgba(255,255,255,0.6)',
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
