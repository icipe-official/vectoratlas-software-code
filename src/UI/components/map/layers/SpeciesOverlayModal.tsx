import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Paper,
  Box,
  IconButton,
  ListItemButton,
  Typography,
  Collapse,
  CircularProgress,
  Checkbox,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Tooltip,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';
import {
  toggleWMTSLayerVisibility,
  drawerListToggle,
} from '../../../state/map/mapSlice';
import { getWMTSOverlays } from '../../../state/map/actions/getWmtsoverlays';
import { WMTSWorkspacesEnum } from '../../../state/state.types';
// Adjust to where DockPanel.tsx lives
import DockPanel from '../../mobileDock/DockPanel';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WMTSLayer {
  name: string;
  title?: string;
  isVisible: boolean;
}

interface LayerItemProps {
  layer: WMTSLayer;
  isLoading?: boolean;
  onToggle: (name: string) => void;
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

// Desktop layout
const SIDEBAR_OPEN_LEFT = 370;
const SIDEBAR_CLOSED_LEFT = 80;
const PANEL_WIDTH_DESKTOP = 320;

// Dock registration
const DOCK_ID = 'species';
const DOCK_TITLE = 'Species';

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION = `all 0.32s ${EASE}`;

// ─── Custom Hook ──────────────────────────────────────────────────────────────

const useSpeciesOverlays = () => {
  const dispatch = useAppDispatch();
  const [isMinimized, setIsMinimized] = useState(false);
  const [loadingLayer, setLoadingLayer] = useState<string | null>(null);
  const [repoLink] = useState('https://doi.org/10.26188/34044441');

  const WMTS_WORKSPACE = WMTSWorkspacesEnum.SPECIES;

  const isSidebarOpen = useAppSelector((s) => s.map.map_drawer.open);
  // Visibility comes from Redux; the dock and the X button both toggle it
  const isVisible = useAppSelector((s) => !!s.map.map_drawer.overlays);
  const wmtsLayers = useAppSelector((s) =>
    s.map.wmtsLayers.filter((layer) => layer.workspace === WMTS_WORKSPACE)
  ) as WMTSLayer[];
  const wmtsStatus = useAppSelector((s) => s.map.wmtsStatus);
  const wmtsWorkspaceLoaded = useAppSelector((s) =>
    s.map.wmtsWorkspaces.includes(WMTS_WORKSPACE)
  );
  const dataState = useAppSelector((s) => s.map.timeSeries.dataState);

  const toggleOverlays = useCallback(() => {
    dispatch(drawerListToggle('overlays'));
  }, [dispatch]);

  useEffect(() => {
    if (loadingLayer) {
      if (dataState === 'ready' || dataState === 'error') {
        const timer = setTimeout(() => setLoadingLayer(null), 250);
        return () => clearTimeout(timer);
      }
    }
  }, [dataState, loadingLayer]);

  useEffect(() => {
    if (isVisible && wmtsStatus !== 'loading' && !wmtsWorkspaceLoaded)
      dispatch(getWMTSOverlays({ workspace: WMTS_WORKSPACE }));
  }, [isVisible, wmtsStatus, wmtsWorkspaceLoaded, dispatch]);

  const toggleMinimized = useCallback(
    () => setIsMinimized((prev) => !prev),
    []
  );
  const handleClose = useCallback(() => {
    toggleOverlays();
  }, [toggleOverlays]);
  const handleToggleLayer = useCallback(
    (name: string) => {
      const layer = wmtsLayers.find((l) => l.name === name);
      if (layer && !layer.isVisible) {
        setLoadingLayer(name);
      }
      dispatch(toggleWMTSLayerVisibility(name));
    },
    [dispatch, wmtsLayers]
  );

  return {
    isVisible,
    isMinimized,
    isSidebarOpen,
    wmtsStatus,
    wmtsLayers,
    loadingLayer,
    repoLink,
    toggleMinimized,
    handleClose,
    handleToggleLayer,
  };
};

// ─── Species Legend ────────────────────────────────────────────────────────────

const LEGEND_STOPS = [
  { label: '0', color: '#9b8d99', description: 'Low values' },
  { label: '0.5', color: '#6b7fa8', description: 'Medium values' },
  { label: '1', color: '#5a3fa3', description: 'High values' },
];

const SpeciesLegend: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  // No flex grow here: it would absorb leftover height and leave a gap
  return (
    <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
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
          Detection probability (≥1 individual, human-landing catch)
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          height: 12,
          borderRadius: '4px',
          background: 'linear-gradient(to right, #9b8d99, #6b7fa8, #5a3fa3)',
          mb: 1,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
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
              borderRadius: '2px',
              background: stop.color,
              border: `1px solid ${
                hovered === i ? '#fff' : 'rgba(255,255,255,0.5)'
              }`,
              cursor: 'pointer',
              transition: TRANSITION,
              zIndex: 2,
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 0.5 }}>
        {LEGEND_STOPS.map((stop, i) => (
          <Typography
            key={stop.label}
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              maxWidth:
                i === 0 || i === LEGEND_STOPS.length - 1 ? '70px' : 'auto',
              textAlign:
                i === 0
                  ? 'left'
                  : i === LEGEND_STOPS.length - 1
                  ? 'right'
                  : 'center',
              color: hovered === i ? '#fff' : TEXT_MUTED,
              fontWeight: hovered === i ? 700 : 500,
              lineHeight: 1.1,
            }}
          >
            {stop.label}
          </Typography>
        ))}
      </Box>

      <Fade in={hovered !== null} timeout={200}>
        <Box
          sx={{
            mt: 1.5,
            px: 1.2,
            py: 0.8,
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft:
              hovered !== null
                ? `3px solid ${LEGEND_STOPS[hovered].color}`
                : 'none',
            minHeight: 32,
          }}
        >
          {hovered !== null && (
            <Typography
              variant="caption"
              sx={{ fontSize: '0.7rem', color: TEXT_PRIMARY }}
            >
              <span
                style={{ color: LEGEND_STOPS[hovered].color, fontWeight: 800 }}
              >
                {LEGEND_STOPS[hovered].label}
              </span>
              {' — '}
              <span style={{ color: TEXT_MUTED }}>
                {LEGEND_STOPS[hovered].description}
              </span>
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
  ({ layer, isLoading, onToggle }) => {
    const label = layer.title
      ? layer.title
          .split('Species_Distribution_Maps__')[1]
          ?.replace(/_/g, ' ') ?? layer.title
      : layer.name
          .split('Species_Distribution_Maps__')[1]
          ?.replace(/_/g, ' ') ?? layer.name;
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
        {isLoading ? (
          <CircularProgress
            size={20}
            sx={{ color: AMBER, mr: 1, ml: 0.5, p: 0.25 }}
          />
        ) : (
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
        )}
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

// Desktop header only. On mobile, DockPanel's title bar takes this role.
const PanelHeader: React.FC<{
  isMinimized: boolean;
  onToggleMinimized: () => void;
  onClose: () => void;
}> = ({ isMinimized, onToggleMinimized, onClose }) => (
  <Box
    onClick={onToggleMinimized}
    sx={{
      px: 2,
      py: 1.4,
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
            fontSize: '0.78rem',
            color: TEXT_PRIMARY,
          }}
        >
          Species
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
  wmtsLayers: WMTSLayer[];
  loadingLayer: string | null;
  repoLink: string;
  onToggleLayer: (name: string) => void;
}> = ({
  isMinimized,
  isMobile,
  wmtsStatus,
  wmtsLayers,
  loadingLayer,
  repoLink,
  onToggleLayer,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  // On mobile, content sizes to its height. On desktop, it fills the panel.
  const grow = isMobile ? 0 : 1;

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
      sx={{
        flexGrow: grow,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        '&.MuiCollapse-entered .MuiCollapse-wrapper': {
          flexGrow: grow,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        },
        '&.MuiCollapse-entered .MuiCollapse-wrapperInner': {
          flexGrow: grow,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        },
      }}
    >
      <Box
        sx={{
          flex: grow,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            flex: isMobile ? 'none' : 9,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Box
            ref={scrollRef}
            sx={{
              px: 1,
              py: 1,
              // On mobile, DockPanel is the scroll area, so the list grows freely
              overflowY: isMobile ? 'visible' : 'auto',
              maxHeight: isMobile ? 'none' : '42vh',
              '&::-webkit-scrollbar': { width: 8 },
              '&::-webkit-scrollbar-thumb': {
                background: ACCENT,
                borderRadius: 10,
              },
              pb: isMobile ? 1 : 0.5,
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
            {wmtsLayers.map((layer) => (
              <LayerItem
                key={layer.name}
                layer={layer}
                isLoading={loadingLayer === layer.name}
                onToggle={onToggleLayer}
              />
            ))}
          </Box>
          {!isMobile && <ScrollHint visible={showScrollHint} />}
        </Box>
        <Box sx={{ px: 1.5, pb: 1, pt: 0.5, zIndex: 4 }}>
          <Tooltip
            title="Link to the repository containing the Species distribution overlays"
            placement="top"
            arrow
          >
            <Button
              href={repoLink}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon sx={{ color: ACCENT }} />}
              sx={{
                justifyContent: 'flex-start',
                color: TEXT_PRIMARY,
                borderColor: BORDER_SUBTLE,
                backgroundColor: 'rgba(255,255,255,0.02)',
                textTransform: 'none',
                borderRadius: '8px',
                py: 0.8,
                px: 1.5,
                '&:hover': {
                  borderColor: ACCENT_BORDER,
                  backgroundColor: ACCENT_DIM,
                  transform: 'translateX(3px)',
                },
                transition: TRANSITION,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, ml: 0.5 }}>
                Download Overlays Repository
              </Typography>
            </Button>
          </Tooltip>
        </Box>
        <Box sx={{ px: 1.5, pt: 0.5 }}>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        </Box>
        <SpeciesLegend />
      </Box>
    </Collapse>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const SpeciesOverlaysPanel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    isVisible,
    isMinimized,
    isSidebarOpen,
    wmtsStatus,
    wmtsLayers,
    loadingLayer,
    repoLink,
    toggleMinimized,
    handleClose,
    handleToggleLayer,
  } = useSpeciesOverlays();

  // Mobile: DockPanel handles open/close, minimize and the dock icon.
  // It must always mount on mobile so it can register when opened.
  if (isMobile) {
    return (
      <DockPanel
        id={DOCK_ID}
        title={DOCK_TITLE}
        icon={LayersIcon}
        open={isVisible}
        onClose={handleClose}
        dark
      >
        <PanelContent
          isMinimized={false}
          isMobile
          wmtsStatus={wmtsStatus}
          wmtsLayers={wmtsLayers}
          loadingLayer={loadingLayer}
          repoLink={repoLink}
          onToggleLayer={handleToggleLayer}
        />
      </DockPanel>
    );
  }

  if (!isVisible) return null;

  const panelLeft = isSidebarOpen ? SIDEBAR_OPEN_LEFT : SIDEBAR_CLOSED_LEFT;

  return (
    <Paper
      elevation={0}
      sx={[
        {
          // position: 'absolute',
          // left: panelLeft,
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
        },
        isMinimized && { minHeight: 'fit-content' },
      ]}
    >
      <PanelHeader
        isMinimized={isMinimized}
        onToggleMinimized={toggleMinimized}
        onClose={handleClose}
      />
      <PanelContent
        isMinimized={isMinimized}
        isMobile={false}
        wmtsStatus={wmtsStatus}
        wmtsLayers={wmtsLayers}
        loadingLayer={loadingLayer}
        repoLink={repoLink}
        onToggleLayer={handleToggleLayer}
      />
    </Paper>
  );
};
