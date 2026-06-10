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
  Button,
  Tooltip,
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
  toggleTimeSeriesGroup,
  TimeSeriesGroup,
} from '../../../state/map/mapSlice';
import { getWMTSOverlays } from '../../../state/map/actions/getWmtsoverlays';
import { WMTSWorkspacesEnum } from '../../../state/state.types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WMTSLayer {
  name: string;
  title?: string;
  isVisible: boolean;
}

interface LayerItemProps {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
  isTimeSeries?: boolean;
  isLoading?: boolean;
}

interface ParsedGroup {
  groupName: string;
  regularLayers: WMTSLayer[];
  timeSeriesGroup?: TimeSeriesGroup;
}

interface LayerGroupProps {
  groupName: string;
  parsedGroup: ParsedGroup;
  isExpanded: boolean;
  onToggleGroup: (name: string) => void;
  onToggleLayer: (name: string) => void;
  onToggleTimeSeries: (group: TimeSeriesGroup) => void;
  activeTimeSeries: Record<string, TimeSeriesGroup>;
  loadingLayer: string | null;
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
const PANEL_TOP_OFFSET = 60;
const PANEL_WIDTH_DESKTOP = 320;

// Mobile layout
const MOBILE_SHEET_MAX_HEIGHT = '72vh';
const MOBILE_SHEET_MIN_HEIGHT = '80px';
const VECTOR_PANEL_MIN_HEIGHT = 52;

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION = `all 0.32s ${EASE}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGroupKey = (name: string): string =>
  name.includes('_ir_') ? name.split('_ir_')[0] : name.split('_')[0];

const normalise = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');

const groupLayers = (layers: WMTSLayer[]): Record<string, ParsedGroup> => {
  const groups: Record<string, ParsedGroup> = {};

  layers.forEach((layer) => {
    const match = layer.name.match(/^(.*?)_ir_(\d{4})(.*)$/);
    const key = getGroupKey(layer.name);

    if (!groups[key]) {
      groups[key] = { groupName: key, regularLayers: [] };
    }

    if (match) {
      const groupName = match[1];
      const yearStr = match[2];
      const year = parseInt(yearStr, 10);

      const startTime = new Date(Date.UTC(year, 0, 1)).getTime();
      const endTime = new Date(
        Date.UTC(year, 11, 31, 23, 59, 59, 999)
      ).getTime();

      if (!groups[key].timeSeriesGroup) {
        groups[key].timeSeriesGroup = {
          id: `ir/${groupName}`,
          groupName: groupName,
          category: 'ir',
          isPlaybackActive: false,
          startTime: startTime,
          endTime: endTime,
          temporalLayers: [],
          defaultResolution: 'year',
        };
      }

      groups[key].timeSeriesGroup!.temporalLayers.push({
        layerName: layer.name,
        startTime,
        endTime,
        timeString: yearStr,
      });

      groups[key].timeSeriesGroup!.startTime = Math.min(
        groups[key].timeSeriesGroup!.startTime,
        startTime
      );
      groups[key].timeSeriesGroup!.endTime = Math.max(
        groups[key].timeSeriesGroup!.endTime,
        endTime
      );
    } else {
      groups[key].regularLayers.push(layer);
    }
  });

  Object.values(groups).forEach((g) => {
    if (g.timeSeriesGroup) {
      g.timeSeriesGroup.temporalLayers.sort(
        (a, b) => a.startTime - b.startTime
      );
    }
  });

  return groups;
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────

const useIROverlays = () => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loadingLayer, setLoadingLayer] = useState<string | null>(null);
  const [repoLink] = useState(
    'https://www.dropbox.com/scl/fo/0nhdpv0ijuk7e4t4v6kfz/AOc-JSNmGZn9FMrZ0c1G7Uo?rlkey=2ntqcnpv2162bj3sfyctbvf64&e=1&st=26321n48&dl=0'
  );

  const WMTS_WORKSPACE = WMTSWorkspacesEnum.IR;

  const isSidebarOpen = useAppSelector((s) => s.map.map_drawer.open);
  const drawerRequestOpen = useAppSelector((s) => s.map.map_drawer.ir_overlays);
  const wmtsLayers = useAppSelector((s) =>
    s.map.wmtsLayers.filter((layer) => layer.workspace === WMTS_WORKSPACE)
  ) as WMTSLayer[];
  const wmtsStatus = useAppSelector((s) => s.map.wmtsStatus);
  const wmtsWorkspaceLoaded = useAppSelector((s) =>
    s.map.wmtsWorkspaces.includes(WMTS_WORKSPACE)
  );
  const dataState = useAppSelector((s) => s.map.timeSeries.dataState);

  useEffect(() => {
    if (loadingLayer) {
      if (dataState === 'ready' || dataState === 'error') {
        const timer = setTimeout(() => setLoadingLayer(null), 250);
        return () => clearTimeout(timer);
      }
    }
  }, [dataState, loadingLayer]);

  useEffect(() => {
    if (drawerRequestOpen) {
      setIsVisible(true);
      if (wmtsStatus !== 'loading' && !wmtsWorkspaceLoaded)
        dispatch(getWMTSOverlays({ workspace: WMTS_WORKSPACE }));
    }
  }, [drawerRequestOpen, wmtsStatus, dispatch]);

  const grouped = useMemo(() => groupLayers(wmtsLayers), [wmtsLayers]);
  const activeTimeSeries = useAppSelector((s) => s.map.timeSeries.groups);

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
    (name: string) => {
      const layer = wmtsLayers.find((l) => l.name === name);
      if (layer && !layer.isVisible) {
        setLoadingLayer(name);
      }
      dispatch(toggleWMTSLayerVisibility(name));
    },
    [dispatch, wmtsLayers]
  );
  const handleToggleTimeSeries = useCallback(
    (group: TimeSeriesGroup) => dispatch(toggleTimeSeriesGroup(group)),
    [dispatch]
  );

  return {
    isVisible,
    isMinimized,
    isSidebarOpen,
    expandedGroup,
    wmtsStatus,
    grouped,
    activeTimeSeries,
    loadingLayer,
    repoLink,
    toggleGroup,
    toggleMinimized,
    handleClose,
    handleToggleLayer,
    handleToggleTimeSeries,
  };
};

// ─── Updated Resistance Legend ────────────────────────────────────────────────

const LEGEND_STOPS = [
  {
    label: '0% (Resistance)',
    color: '#8b3d03',
    description: 'High mortality resistance observed.',
  },
  {
    label: '50%',
    color: '#e68a2e',
    description: 'Moderate susceptibility signals.',
  },
  {
    label: '100% (Susceptible)',
    color: '#fff9e6',
    description: 'Full susceptibility confirmed.',
  },
];

const ResistanceLegend: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Box sx={{ px: 1.5, pt: 1.5, pb: 2, flex: 1 }}>
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
          Bioassay Mortality (0–100%)
        </Typography>
      </Box>

      {/* Gradient Bar based on image_4e0fb0.png */}
      <Box
        sx={{
          position: 'relative',
          height: 12,
          borderRadius: '4px',
          background: 'linear-gradient(to right, #8b3d03, #e68a2e, #fff9e6)',
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
                {LEGEND_STOPS[hovered].label.split(' (')[0]}
              </span>
              {' — '}
              {LEGEND_STOPS[hovered].description}
            </Typography>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

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
        zIndex: 3,
        pb: 0.5,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background:
          'linear-gradient(to bottom, transparent, rgba(18,24,20,0.95))',
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
  ({ label, isChecked, onToggle, isTimeSeries, isLoading }) => {
    return (
      <ListItemButton
        onClick={onToggle}
        sx={{
          borderRadius: '6px',
          mb: 0.25,
          py: 0.7,
          px: 1,
          transition: TRANSITION,
          background: isChecked ? AMBER_DIM : 'transparent',
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
            checked={isChecked}
            size="small"
            disableRipple
            sx={{
              p: 0.5,
              mr: 1,
              color: 'rgba(255,255,255,0.18)',
              '&.Mui-checked': { color: AMBER },
            }}
          />
        )}
        <Typography
          variant="caption"
          sx={{
            fontSize: { xs: '0.8rem', sm: '0.74rem' },
            color: isChecked ? TEXT_PRIMARY : TEXT_MUTED,
            fontWeight: isChecked ? 500 : 400,
            textTransform: 'capitalize',
          }}
        >
          {label}{' '}
          {isTimeSeries && (
            <span
              style={{
                opacity: 0.6,
                fontStyle: 'italic',
                textTransform: 'none',
              }}
            >
              (Time Series)
            </span>
          )}
        </Typography>
      </ListItemButton>
    );
  }
);
LayerItem.displayName = 'LayerItem';

const LayerGroup: React.FC<LayerGroupProps> = React.memo(
  ({
    groupName,
    parsedGroup,
    isExpanded,
    onToggleGroup,
    onToggleLayer,
    onToggleTimeSeries,
    activeTimeSeries,
    loadingLayer,
  }) => {
    const isTimeSeriesActive = parsedGroup.timeSeriesGroup
      ? !!activeTimeSeries[parsedGroup.timeSeriesGroup.id]?.isPlaybackActive
      : false;
    const activeCount = useMemo(
      () =>
        parsedGroup.regularLayers.filter((l) => l.isVisible).length +
        (isTimeSeriesActive ? 1 : 0),
      [parsedGroup.regularLayers, isTimeSeriesActive]
    );
    const displayName = groupName.replace(/-/g, ' ');

    const isSingleDuplicate = useMemo(() => {
      if (parsedGroup.timeSeriesGroup) return false;
      if (parsedGroup.regularLayers.length !== 1) return false;
      const layer = parsedGroup.regularLayers[0];
      const layerLabel =
        layer.title ??
        layer.name.split('_ir_').pop()?.replace(/_/g, ' ') ??
        layer.name;
      return normalise(layerLabel) === normalise(displayName);
    }, [parsedGroup, displayName]);

    if (isSingleDuplicate) {
      const layer = parsedGroup.regularLayers[0];
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
            {loadingLayer === layer.name ? (
              <CircularProgress
                size={20}
                sx={{ color: ACCENT, mr: 1, ml: 0.5, p: 0.25 }}
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
                  '&.Mui-checked': { color: ACCENT },
                }}
              />
            )}
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
        {/* <Collapse in={isExpanded} timeout={280} unmountOnExit> */}
        <Collapse in={isExpanded} timeout={280}>
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
              {parsedGroup.timeSeriesGroup && (
                <LayerItem
                  key={parsedGroup.timeSeriesGroup.id}
                  label={displayName}
                  isChecked={isTimeSeriesActive}
                  onToggle={() =>
                    onToggleTimeSeries(parsedGroup.timeSeriesGroup!)
                  }
                  isTimeSeries={true}
                />
              )}
              {parsedGroup.regularLayers.map((layer) => {
                const label =
                  layer.title ??
                  layer.name.split('_ir_').pop()?.replace(/_/g, ' ') ??
                  layer.name;
                return (
                  <LayerItem
                    key={layer.name}
                    label={label}
                    isChecked={layer.isVisible}
                    isLoading={loadingLayer === layer.name}
                    onToggle={() => onToggleLayer(layer.name)}
                  />
                );
              })}
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
          Species Overlays
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
  grouped: Record<string, ParsedGroup>;
  expandedGroup: string | null;
  activeTimeSeries: Record<string, TimeSeriesGroup>;
  loadingLayer: string | null;
  repoLink: string;
  onToggleGroup: (name: string) => void;
  onToggleLayer: (name: string) => void;
  onToggleTimeSeries: (group: TimeSeriesGroup) => void;
}> = ({
  isMinimized,
  isMobile,
  wmtsStatus,
  grouped,
  expandedGroup,
  activeTimeSeries,
  loadingLayer,
  repoLink,
  onToggleGroup,
  onToggleLayer,
  onToggleTimeSeries,
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
      sx={{
        flexGrow: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        '&.MuiCollapse-entered .MuiCollapse-wrapper': {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        },
        '&.MuiCollapse-entered .MuiCollapse-wrapperInner': {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            flex: 9,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              minHeight: 0,
              px: 1,
              py: 1,
              overflowY: 'auto',
              maxHeight: isMobile
                ? `calc(${MOBILE_SHEET_MAX_HEIGHT} - 160px)`
                : '100%',
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
            {Object.entries(grouped).map(([groupName, parsedGroup]) => (
              <LayerGroup
                key={groupName}
                groupName={groupName}
                parsedGroup={parsedGroup}
                isExpanded={expandedGroup === groupName}
                onToggleGroup={onToggleGroup}
                onToggleLayer={onToggleLayer}
                onToggleTimeSeries={onToggleTimeSeries}
                activeTimeSeries={activeTimeSeries}
                loadingLayer={loadingLayer}
              />
            ))}
          </Box>
          <ScrollHint visible={showScrollHint} />
        </Box>

        <Box sx={{ px: 1.5, pb: 1, pt: 0.5, zIndex: 4 }}>
          <Tooltip
            title="Link to the repository containing the IR overlays"
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

        <Box sx={{ px: 1.5 }}>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        </Box>
        <ResistanceLegend />
      </Box>
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
    activeTimeSeries,
    loadingLayer,
    repoLink,
    toggleGroup,
    toggleMinimized,
    handleClose,
    handleToggleLayer,
    handleToggleTimeSeries,
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
            flex: 1,
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
            activeTimeSeries={activeTimeSeries}
            loadingLayer={loadingLayer}
            repoLink={repoLink}
            onToggleGroup={toggleGroup}
            onToggleLayer={handleToggleLayer}
            onToggleTimeSeries={handleToggleTimeSeries}
          />
        </Paper>
      </Slide>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={[
        {
          // position: 'absolute',
          // top: PANEL_TOP_OFFSET,
          // left: panelLeft,
          width: PANEL_WIDTH_DESKTOP,
          maxHeight: isMinimized ? 'fit-content' : 'calc(100vh - 120px)',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          left: isSidebarOpen ? SIDEBAR_OPEN_LEFT : SIDEBAR_CLOSED_LEFT,
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
        activeTimeSeries={activeTimeSeries}
        loadingLayer={loadingLayer}
        repoLink={repoLink}
        onToggleGroup={toggleGroup}
        onToggleLayer={handleToggleLayer}
        onToggleTimeSeries={handleToggleTimeSeries}
      />
    </Paper>
  );
};
