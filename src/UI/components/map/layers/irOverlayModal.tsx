import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  useTheme,
  useMediaQuery,
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface WMTSLayer {
  name: string;
  title?: string;
  isVisible: boolean;
}

interface LayerItemProps {
  layer: WMTSLayer;
  onToggle: (name: string) => void;
}

interface LayerGroupProps {
  groupName: string;
  layers: WMTSLayer[];
  isExpanded: boolean;
  onToggleGroup: (name: string) => void;
  onToggleLayer: (name: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_OPEN_LEFT = 380;
const SIDEBAR_CLOSED_LEFT = 80;
const PANEL_TOP_OFFSET = 60;
const PANEL_WIDTH_DESKTOP = 340;
const PANEL_WIDTH_MOBILE = '100%';
const ACCENT_COLOR = '#38bdf8';
const ACCENT_BG = 'rgba(56, 189, 248, 0.08)';
const ACCENT_BORDER = 'rgba(56, 189, 248, 0.2)';
const GLASS_BG = 'rgba(15, 23, 42, 0.85)';
const TRANSITION = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

/** Extracts a display-friendly group key from a layer name */
const getGroupKey = (name: string): string =>
  name.includes('_ir_') ? name.split('_ir_')[0] : name.split('_')[0];

/** Groups layers by their derived group key */
const groupLayers = (layers: WMTSLayer[]): Record<string, WMTSLayer[]> =>
  layers.reduce<Record<string, WMTSLayer[]>>((acc, layer) => {
    const key = getGroupKey(layer.name);
    acc[key] = acc[key] ?? [];
    acc[key].push(layer);
    return acc;
  }, {});

// ─── Custom Hook ──────────────────────────────────────────────────────────────

const useIROverlays = () => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const isSidebarOpen = useAppSelector((state) => state.map.map_drawer.open);
  const drawerRequestOpen = useAppSelector((s) => s.map.map_drawer.ir_overlays);
  const wmtsLayers = useAppSelector((s) => s.map.wmtsLayers) as WMTSLayer[];
  const wmtsStatus = useAppSelector((s) => s.map.wmtsStatus);

  useEffect(() => {
    if (drawerRequestOpen) {
      setIsVisible(true);
      if (wmtsStatus === 'idle') {
        dispatch(getWMTSOverlays());
      }
    }
  }, [drawerRequestOpen, wmtsStatus, dispatch]);

  const grouped = useMemo(() => groupLayers(wmtsLayers), [wmtsLayers]);

  const toggleGroup = useCallback((name: string) => {
    setExpandedGroup((prev) => (prev === name ? null : name));
  }, []);

  const toggleMinimized = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    dispatch(drawerListToggle('ir_overlays'));
  }, [dispatch]);

  const handleToggleLayer = useCallback(
    (name: string) => dispatch(toggleWMTSLayerVisibility(name)),
    [dispatch]
  );

  return {
    isVisible,
    isMinimized,
    isSidebarOpen,
    expandedGroup,
    wmtsStatus,
    grouped,
    toggleGroup,
    toggleMinimized,
    handleClose,
    handleToggleLayer,
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const LayerItem: React.FC<LayerItemProps> = React.memo(
  ({ layer, onToggle }) => {
    const label =
      layer.title ??
      layer.name.split('_ir_').pop()?.replace(/_/g, ' ') ??
      layer.name;

    return (
      <ListItemButton
        onClick={() => onToggle(layer.name)}
        aria-pressed={layer.isVisible}
        aria-label={`Toggle ${label}`}
        sx={{
          borderRadius: '6px',
          mb: 0.2,
          '&:hover': { background: `${ACCENT_COLOR}0D` }, // 5% opacity
        }}
      >
        <Checkbox
          checked={layer.isVisible}
          size="small"
          disableRipple
          tabIndex={-1} // button handles focus; checkbox is decorative
          sx={{
            p: 0.5,
            mr: 1,
            color: 'rgba(255,255,255,0.2)',
            '&.Mui-checked': { color: ACCENT_COLOR },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            color: layer.isVisible ? '#fff' : 'rgba(255,255,255,0.5)',
            fontWeight: layer.isVisible ? 500 : 400,
            textTransform: 'capitalize',
          }}
        >
          {label}
        </Typography>
      </ListItemButton>
    );
  }
);

LayerItem.displayName = 'LayerItem';

const LayerGroup: React.FC<LayerGroupProps> = React.memo(
  ({ groupName, layers, isExpanded, onToggleGroup, onToggleLayer }) => {
    const activeCount = useMemo(
      () => layers.filter((l) => l.isVisible).length,
      [layers]
    );
    const displayName = groupName.replace(/-/g, ' ');

    return (
      <Box sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={() => onToggleGroup(groupName)}
          aria-expanded={isExpanded}
          aria-label={`${
            isExpanded ? 'Collapse' : 'Expand'
          } ${displayName} group`}
          sx={{
            borderRadius: '8px',
            py: 1,
            transition: TRANSITION,
            background: isExpanded ? ACCENT_BG : 'transparent',
            border: `1px solid ${isExpanded ? ACCENT_BORDER : 'transparent'}`,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.05)',
              transform: 'translateX(2px)',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              flexGrow: 1,
              fontSize: '0.85rem',
              fontWeight: isExpanded ? 600 : 400,
              color: activeCount > 0 ? ACCENT_COLOR : '#cbd5e1',
              textTransform: 'capitalize',
            }}
          >
            {displayName}
          </Typography>

          {activeCount > 0 && !isExpanded && (
            <Box
              component="span"
              aria-label={`${activeCount} active`}
              sx={{
                mr: 1,
                px: 0.8,
                borderRadius: '4px',
                background: ACCENT_COLOR,
                color: '#0f172a',
                fontSize: '0.65rem',
                fontWeight: 900,
              }}
            >
              {activeCount}
            </Box>
          )}

          {isExpanded ? (
            <ExpandLess fontSize="small" sx={{ color: ACCENT_COLOR }} />
          ) : (
            <ExpandMore fontSize="small" sx={{ opacity: 0.5 }} />
          )}
        </ListItemButton>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List dense disablePadding sx={{ pl: 1, py: 0.5 }}>
            {layers.map((layer) => (
              <LayerItem
                key={layer.name}
                layer={layer}
                onToggle={onToggleLayer}
              />
            ))}
          </List>
        </Collapse>
      </Box>
    );
  }
);

LayerGroup.displayName = 'LayerGroup';

// ─── Main Component ───────────────────────────────────────────────────────────

export const IROverlaysPanel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    isVisible,
    isMinimized,
    isSidebarOpen,
    expandedGroup,
    wmtsStatus,
    grouped,
    toggleGroup,
    toggleMinimized,
    handleClose,
    handleToggleLayer,
  } = useIROverlays();

  if (!isVisible) return null;

  const panelLeft = isMobile
    ? 0
    : isSidebarOpen
    ? SIDEBAR_OPEN_LEFT
    : SIDEBAR_CLOSED_LEFT;

  return (
    <Paper
      elevation={0}
      role="region"
      aria-label="IR Overlays Panel"
      sx={{
        position: 'absolute',
        top: isMobile ? 'auto' : PANEL_TOP_OFFSET,
        bottom: isMobile ? 0 : 'auto',
        left: panelLeft,
        right: isMobile ? 0 : 'auto',
        width: isMobile ? PANEL_WIDTH_MOBILE : PANEL_WIDTH_DESKTOP,
        maxHeight: isMinimized
          ? 'fit-content'
          : isMobile
          ? '50vh'
          : 'calc(100vh - 120px)',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: `${TRANSITION}, left 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
        backdropFilter: 'blur(12px) saturate(160%)',
        background: GLASS_BG,
        color: '#f8fafc',
        borderRadius: isMobile ? '16px 16px 0 0' : '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: isMinimized
            ? 'none'
            : '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={toggleMinimized}
        role="button"
        aria-expanded={!isMinimized}
        aria-label={`${isMinimized ? 'Expand' : 'Collapse'} IR Overlays panel`}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LayersIcon sx={{ color: ACCENT_COLOR, fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 300, letterSpacing: '0.5px' }}
          >
            Insecticide Resistance Overlays
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimized();
            }}
            aria-label={isMinimized ? 'Expand panel' : 'Minimize panel'}
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
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            aria-label="Close IR Overlays panel"
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              '&:hover': {
                color: ACCENT_COLOR,
                background: `${ACCENT_COLOR}1A`, // 10% opacity
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Collapse
        in={!isMinimized}
        timeout="auto"
        sx={{ flexGrow: 1, overflow: 'hidden' }}
      >
        <Box
          sx={{
            px: 1,
            py: 1,
            overflowY: 'auto',
            maxHeight: isMobile ? 'calc(50vh - 56px)' : '60vh',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 10,
            },
          }}
        >
          {wmtsStatus === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress
                size={20}
                sx={{ color: ACCENT_COLOR }}
                aria-label="Loading layers"
              />
            </Box>
          )}

          {wmtsStatus !== 'loading' && Object.keys(grouped).length === 0 && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                py: 3,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              No overlay layers available.
            </Typography>
          )}

          {Object.entries(grouped).map(([groupName, layers]) => (
            <LayerGroup
              key={groupName}
              groupName={groupName}
              layers={layers}
              isExpanded={expandedGroup === groupName}
              onToggleGroup={toggleGroup}
              onToggleLayer={handleToggleLayer}
            />
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};
