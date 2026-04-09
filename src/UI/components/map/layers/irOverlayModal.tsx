import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
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
  Divider,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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

// ─── Design Tokens ────────────────────────────────────────────────────────────

const ACCENT = '#6baa75';
const ACCENT_DIM = 'rgba(107,170,117,0.12)';
const ACCENT_BORDER = 'rgba(107,170,117,0.28)';
const ACCENT_GLOW = 'rgba(107,170,117,0.15)';

const AMBER = '#c8925a';
const AMBER_DIM = 'rgba(200,146,90,0.10)';

const PANEL_BG = 'rgba(18, 24, 20, 0.95)';
const HEADER_BG = 'rgba(255,255,255,0.025)';
const BORDER_SUBTLE = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#e8ede9';
const TEXT_MUTED = 'rgba(232,237,233,0.45)';
const TEXT_FAINT = 'rgba(232,237,233,0.28)';

// Desktop layout
const SIDEBAR_OPEN_LEFT = 370;
const SIDEBAR_CLOSED_LEFT = 80;
const PANEL_TOP_OFFSET = 60;
const PANEL_WIDTH_DESKTOP = 320;

// Mobile layout
const MOBILE_SHEET_MAX_HEIGHT = '72vh';
const MOBILE_SHEET_MIN_HEIGHT = '56px';
const VECTOR_PANEL_MIN_HEIGHT = 52;

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION = `all 0.32s ${EASE}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGroupKey = (name: string): string =>
  name.includes('_ir_') ? name.split('_ir_')[0] : name.split('_')[0];

const normalise = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');

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

  const isSidebarOpen = useAppSelector((s) => s.map.map_drawer.open);
  const drawerRequestOpen = useAppSelector((s) => s.map.map_drawer.ir_overlays);
  const wmtsLayers = useAppSelector((s) => s.map.wmtsLayers) as WMTSLayer[];
  const wmtsStatus = useAppSelector((s) => s.map.wmtsStatus);

  useEffect(() => {
    if (drawerRequestOpen) {
      setIsVisible(true);
      if (wmtsStatus === 'idle') dispatch(getWMTSOverlays());
    }
  }, [drawerRequestOpen, wmtsStatus, dispatch]);

  const grouped = useMemo(() => groupLayers(wmtsLayers), [wmtsLayers]);
  const toggleGroup = useCallback(
    (name: string) => setExpandedGroup((prev) => (prev === name ? null : name)),
    []
  );
  const toggleMinimized = useCallback(
    () => setIsMinimized((prev) => !prev),
    []
  );
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

// ─── Resistance Legend ────────────────────────────────────────────────────────
const LEGEND_STOPS = [
  { label: 'Resistant', color: '#f44336', short: 'R' },
  { label: 'Moderate', color: '#ffeb3b', short: 'M' },
  { label: 'Possible', color: '#cddc39', short: 'P' },
  { label: 'Susceptible', color: '#4caf50', short: 'S' },
];

const ResistanceLegend: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Box sx={{ px: 1.5, pt: 1.5, pb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.6rem',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: TEXT_MUTED,
            fontWeight: 600,
          }}
        >
          Resistance Legend
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          height: 10,
          borderRadius: '6px',
          background:
            'linear-gradient(to right, #f44336, #ff9800, #ffeb3b, #cddc39, #4caf50)',
          mb: 1,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
        }}
      >
        {LEGEND_STOPS.map((stop, i) => (
          <Box
            key={stop.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            sx={{
              position: 'absolute',
              left: `${(i / (LEGEND_STOPS.length - 1)) * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: hovered === i ? 14 : 10,
              height: hovered === i ? 14 : 10,
              borderRadius: '50%',
              background: stop.color,
              border: `2px solid ${
                hovered === i ? '#fff' : 'rgba(255,255,255,0.3)'
              }`,
              cursor: 'pointer',
              transition: TRANSITION,
              zIndex: 2,
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {LEGEND_STOPS.map((stop, i) => (
          <Typography
            key={stop.label}
            variant="caption"
            sx={{
              fontSize: '0.6rem',
              color: hovered === i ? stop.color : TEXT_MUTED,
              fontWeight: hovered === i ? 700 : 400,
            }}
          >
            {stop.label}
          </Typography>
        ))}
      </Box>

      <Fade in={hovered !== null} timeout={200}>
        <Box
          sx={{
            mt: 1,
            px: 1.5,
            py: 0.6,
            borderRadius: '6px',
            background:
              hovered !== null
                ? `${LEGEND_STOPS[hovered].color}22`
                : 'transparent',
            border: `1px solid ${
              hovered !== null
                ? LEGEND_STOPS[hovered].color + '44'
                : 'transparent'
            }`,
            minHeight: 28,
          }}
        >
          {hovered !== null && (
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.68rem',
                color: LEGEND_STOPS[hovered].color,
                fontWeight: 500,
              }}
            >
              <strong>{LEGEND_STOPS[hovered].label}</strong>
              {' — '}
              {
                [
                  'Full resistance.',
                  'Moderate resistance.',
                  'Low-level signals.',
                  'No signs.',
                ][hovered]
              }
            </Typography>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

const ScrollHint: React.FC<{ visible: boolean }> = ({ visible }) => (
  <Fade in={visible} timeout={400}>
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        pointerEvents: 'none',
        background:
          'linear-gradient(to bottom, transparent, rgba(18,24,20,0.95))',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pb: 0.5,
        zIndex: 3,
      }}
    >
      <KeyboardArrowDownIcon
        sx={{
          color: TEXT_MUTED,
          fontSize: 18,
          animation: 'bounceDown 1.6s ease-in-out infinite',
          '@keyframes bounceDown': {
            '0%, 100%': { transform: 'translateY(0)', opacity: 0.6 },
            '50%': { transform: 'translateY(4px)', opacity: 1 },
          },
        }}
      />
    </Box>
  </Fade>
);

const LayerItem: React.FC<LayerItemProps> = React.memo(
  ({ layer, onToggle }) => {
    const label =
      layer.title ??
      layer.name.split('_ir_').pop()?.replace(/_/g, ' ') ??
      layer.name;
    return (
      <ListItemButton
        onClick={() => onToggle(layer.name)}
        sx={{
          borderRadius: '6px',
          mb: 0.25,
          py: 0.7,
          px: 1,
          minHeight: { xs: 44, sm: 'auto' },
          transition: TRANSITION,
          background: layer.isVisible ? AMBER_DIM : 'transparent',
          '&:hover': {
            background: 'rgba(255,255,255,0.04)',
            transform: 'translateX(3px)',
          },
        }}
      >
        <Checkbox
          checked={layer.isVisible}
          size="small"
          disableRipple
          sx={{
            p: 0.5,
            mr: 1,
            color: 'rgba(255,255,255,0.18)',
            '&.Mui-checked': { color: AMBER },
            '& .MuiSvgIcon-root': { fontSize: { xs: '1.1rem', sm: '1rem' } },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: { xs: '0.8rem', sm: '0.74rem' },
            color: layer.isVisible ? TEXT_PRIMARY : TEXT_MUTED,
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

    const isSingleDuplicate = useMemo(() => {
      if (layers.length !== 1) return false;
      const layer = layers[0];
      const layerLabel =
        layer.title ??
        layer.name.split('_ir_').pop()?.replace(/_/g, ' ') ??
        layer.name;
      return normalise(layerLabel) === normalise(displayName);
    }, [layers, displayName]);

    if (isSingleDuplicate) {
      const layer = layers[0];
      return (
        <Box sx={{ mb: 0.4 }}>
          <ListItemButton
            onClick={() => onToggleLayer(layer.name)}
            sx={{
              borderRadius: '8px',
              py: 0.9,
              px: 1.5,
              background: layer.isVisible ? ACCENT_DIM : 'transparent',
              border: `1px solid ${
                layer.isVisible ? ACCENT_BORDER : 'transparent'
              }`,
              '&:hover': {
                background: 'rgba(255,255,255,0.04)',
                transform: 'translateX(3px)',
              },
            }}
          >
            <Checkbox
              checked={layer.isVisible}
              size="small"
              disableRipple
              sx={{
                p: 0.5,
                mr: 1,
                color: 'rgba(255,255,255,0.18)',
                '&.Mui-checked': { color: ACCENT },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                flexGrow: 1,
                color: layer.isVisible ? ACCENT : TEXT_PRIMARY,
                textTransform: 'capitalize',
              }}
            >
              {displayName}
            </Typography>
          </ListItemButton>
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 0.4 }}>
        <ListItemButton
          onClick={() => onToggleGroup(groupName)}
          sx={{
            borderRadius: '8px',
            py: 0.9,
            px: 1.5,
            background: isExpanded ? ACCENT_DIM : 'transparent',
            border: `1px solid ${isExpanded ? ACCENT_BORDER : 'transparent'}`,
            '&:hover': {
              background: 'rgba(255,255,255,0.04)',
              transform: 'translateX(3px)',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              flexGrow: 1,
              fontWeight: isExpanded ? 600 : 400,
              color: activeCount > 0 ? ACCENT : TEXT_PRIMARY,
              textTransform: 'capitalize',
            }}
          >
            {displayName}
          </Typography>
          {activeCount > 0 && !isExpanded && (
            <Box
              component="span"
              sx={{
                mr: 1,
                px: 0.75,
                borderRadius: '4px',
                background: ACCENT,
                color: '#0f1a12',
                fontSize: '0.62rem',
                fontWeight: 800,
              }}
            >
              {activeCount}
            </Box>
          )}
          {isExpanded ? (
            <ExpandLess fontSize="small" sx={{ color: ACCENT }} />
          ) : (
            <ExpandMore fontSize="small" sx={{ color: ACCENT }} />
          )}
        </ListItemButton>
        <Collapse in={isExpanded} timeout={280} unmountOnExit>
          <Box sx={{ position: 'relative', mt: 0.25, pl: 2.5, pb: 0.5 }}>
            <Box
              sx={{
                position: 'absolute',
                left: 14,
                top: 4,
                bottom: 4,
                width: '2px',
                background: `linear-gradient(to bottom, ${ACCENT_BORDER}, transparent)`,
              }}
            />
            <List dense disablePadding>
              {layers.map((layer) => (
                <LayerItem
                  key={layer.name}
                  layer={layer}
                  onToggle={onToggleLayer}
                />
              ))}
            </List>
          </Box>
        </Collapse>
      </Box>
    );
  }
);
LayerGroup.displayName = 'LayerGroup';

const PanelHeader: React.FC<{
  isMinimized: boolean;
  isMobile: boolean;
  onToggleMinimized: () => void;
  onClose: () => void;
}> = ({ isMinimized, isMobile, onToggleMinimized, onClose }) => (
  <Box
    onClick={onToggleMinimized}
    sx={{
      px: 2,
      py: isMobile ? 1.2 : 1.4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: isMinimized ? 'none' : `1px solid ${BORDER_SUBTLE}`,
      cursor: 'pointer',
      background: `linear-gradient(105deg, ${ACCENT_GLOW} 0%, ${HEADER_BG} 55%)`,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30,
          borderRadius: '7px',
          background: ACCENT_DIM,
          border: `1px solid ${ACCENT_BORDER}`,
        }}
      >
        <LayersIcon sx={{ color: ACCENT, fontSize: 16 }} />
      </Box>
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.82rem', sm: '0.78rem' },
            color: TEXT_PRIMARY,
          }}
        >
          Insecticide Resistance
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: '0.62rem', color: ACCENT, fontWeight: 600 }}
        >
          Overlays
        </Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', gap: 0.25 }}>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onToggleMinimized();
        }}
      >
        {isMinimized ? (
          <ExpandMore fontSize="small" sx={{ color: ACCENT }} />
        ) : (
          <ExpandLess fontSize="small" sx={{ color: ACCENT }} />
        )}
      </IconButton>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <CloseIcon fontSize="small" sx={{ color: ACCENT }} />
      </IconButton>
    </Box>
  </Box>
);

const PanelContent: React.FC<{
  isMinimized: boolean;
  isMobile: boolean;
  wmtsStatus: string;
  grouped: Record<string, WMTSLayer[]>;
  expandedGroup: string | null;
  onToggleGroup: (name: string) => void;
  onToggleLayer: (name: string) => void;
}> = ({
  isMinimized,
  isMobile,
  wmtsStatus,
  grouped,
  expandedGroup,
  onToggleGroup,
  onToggleLayer,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isOverflowing = el.scrollHeight > el.clientHeight + 4;
    const isNotAtBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 8;
    setShowScrollHint(isOverflowing && isNotAtBottom);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, isMinimized]);

  return (
    <Collapse
      in={!isMinimized}
      timeout={300}
      sx={{ flexGrow: 1, overflow: 'hidden' }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          ref={scrollRef}
          sx={{
            px: 1,
            py: 1,
            overflowY: 'auto',
            maxHeight: isMobile
              ? `calc(${MOBILE_SHEET_MAX_HEIGHT} - 160px)`
              : '42vh',
            '&::-webkit-scrollbar': { width: 8 },
            '&::-webkit-scrollbar-thumb': {
              background: ACCENT,
              borderRadius: 10,
            },
            pb: isMobile ? 'max(8px, env(safe-area-inset-bottom))' : 0.5,
          }}
        >
          {wmtsStatus === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress
                size={18}
                thickness={4}
                sx={{ color: ACCENT }}
              />
            </Box>
          )}
          {Object.entries(grouped).map(([groupName, layers]) => (
            <LayerGroup
              key={groupName}
              groupName={groupName}
              layers={layers}
              isExpanded={expandedGroup === groupName}
              onToggleGroup={onToggleGroup}
              onToggleLayer={onToggleLayer}
            />
          ))}
        </Box>
        <ScrollHint visible={showScrollHint} />
      </Box>
      <Box sx={{ px: 1.5, pt: 0.5 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
      </Box>
      <ResistanceLegend />
    </Collapse>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const IROverlaysPanel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isVectorPanelVisible = useAppSelector((s) => s.map.map_drawer.open);

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

  if (isMobile) {
    return (
      <Slide
        direction="up"
        in={isVisible}
        mountOnEnter
        unmountOnExit
        timeout={320}
      >
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: isVectorPanelVisible ? `${VECTOR_PANEL_MIN_HEIGHT}px` : 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: isMinimized
              ? MOBILE_SHEET_MIN_HEIGHT
              : MOBILE_SHEET_MAX_HEIGHT,
            transition: `bottom 0.3s ${EASE}, max-height 0.38s ${EASE}`,
            backdropFilter: 'blur(20px) saturate(140%)',
            background: PANEL_BG,
            color: TEXT_PRIMARY,
            borderRadius: isVectorPanelVisible ? '16px' : '16px 16px 0 0',
            margin: isVectorPanelVisible ? '0 8px 8px 8px' : '0',
            width: isVectorPanelVisible ? 'calc(100% - 16px)' : '100%',
            border: `1px solid ${BORDER_SUBTLE}`,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.45)',
          }}
        >
          <Box
            onClick={toggleMinimized}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 0.75,
              pb: 0.25,
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 4,
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.2)',
              }}
            />
          </Box>
          <PanelHeader
            isMinimized={isMinimized}
            isMobile
            onToggleMinimized={toggleMinimized}
            onClose={handleClose}
          />
          <PanelContent
            isMinimized={isMinimized}
            isMobile
            wmtsStatus={wmtsStatus}
            grouped={grouped}
            expandedGroup={expandedGroup}
            onToggleGroup={toggleGroup}
            onToggleLayer={handleToggleLayer}
          />
        </Paper>
      </Slide>
    );
  }

  const panelLeft = isSidebarOpen ? SIDEBAR_OPEN_LEFT : SIDEBAR_CLOSED_LEFT;

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'absolute',
        top: PANEL_TOP_OFFSET,
        left: panelLeft,
        width: PANEL_WIDTH_DESKTOP,
        maxHeight: isMinimized ? 'fit-content' : 'calc(100vh - 120px)',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: `max-height 0.35s ${EASE}, left 0.4s ${EASE}`,
        backdropFilter: 'blur(16px) saturate(140%)',
        background: PANEL_BG,
        color: TEXT_PRIMARY,
        borderRadius: '12px',
        border: `1px solid ${BORDER_SUBTLE}`,
        boxShadow: '0 20px 40px -8px rgba(0,0,0,0.5)',
      }}
    >
      <PanelHeader
        isMinimized={isMinimized}
        isMobile={false}
        onToggleMinimized={toggleMinimized}
        onClose={handleClose}
      />
      <PanelContent
        isMinimized={isMinimized}
        isMobile={false}
        wmtsStatus={wmtsStatus}
        grouped={grouped}
        expandedGroup={expandedGroup}
        onToggleGroup={toggleGroup}
        onToggleLayer={handleToggleLayer}
      />
    </Paper>
  );
};
