import React, { useEffect, useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { PieChart, Pie, Cell } from 'recharts';
import { speciesStyle } from './types';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';
import { GENERIC_GREEN } from './pointutilswebgl';
import { Tooltip } from 'recharts';

interface MapHUDProps {
  panelOpen: boolean;
  setPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  occurrenceLoading: boolean;
  visiblePointCount: number;
  speciesCounts: Record<string, number>;
  speciesStyles: speciesStyle[];
  activeSpecies: string | null;
  hoveredSpecies: string | null;
  setHoveredSpecies: (species: string | null) => void;
  selectedIdsLength: number;
  speciesRowRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  normalize: (s: string) => string;
  showDetected: boolean;
  setShowDetected: React.Dispatch<React.SetStateAction<boolean>>;
  showNotDetected: boolean;
  setShowNotDetected: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapHUD: React.FC<MapHUDProps> = ({
  panelOpen,
  setPanelOpen,
  occurrenceLoading,
  visiblePointCount,
  speciesCounts,
  speciesStyles,
  activeSpecies,
  hoveredSpecies,
  setHoveredSpecies,
  selectedIdsLength,
  speciesRowRefs,
  normalize,
  showDetected,
  setShowDetected,
  showNotDetected,
  setShowNotDetected,
}) => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));          // < 600 px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600–900 px

  /* ── species display helpers ── */
  const speciesDisplayMap: Record<string, string> = {
    'coluzzii_gambiae_m form': ' coluzzii',
    'gambiae_s form': ' gambiae',
    'gambiae_s form_m form': ' gambiae/ coluzzii',
  };

  const getPresenceStatus = (value: unknown): 'presence' | 'absence' | 'unknown' => {
    const v = String(value ?? '').toLowerCase().trim();
    if (v === '1' || v === 'true'  || v === 'presence' || v === 'present') return 'presence';
    if (v === '0' || v === 'false' || v === 'absence'  || v === 'absent' ) return 'absence';
    return 'unknown';
  };

  const getSpeciesDisplayName = (rawSpecies: string): string => {
    const match = Object.keys(speciesDisplayMap).find(
      (key) => normalize(key) === rawSpecies || key === rawSpecies
    );
    return match ? speciesDisplayMap[match] : ` ${rawSpecies}`;
  };

  /* ── state ── */
  const [showJumpTop,          setShowJumpTop]          = useState(false);
  const [animatedVisibleCount, setAnimatedVisibleCount] = useState(0);
  const [othersExpanded,       setOthersExpanded]       = useState(false);
  const [touchedSpecies,       setTouchedSpecies]       = useState<string | null>(null);
  const [mobileSheetOpen,      setMobileSheetOpen]      = useState(false); // mobile bottom-sheet

  const pingRef          = useRef<HTMLDivElement | null>(null);
  const animationRef     = useRef<number | null>(null);
  const sublistRef       = useRef<HTMLDivElement | null>(null);
  const hideTooltipTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSublistScroll = (e: React.UIEvent<HTMLDivElement>) =>
    setShowJumpTop(e.currentTarget.scrollTop > 100);

  /* ── count animation ── */
  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const animate = () => {
      setAnimatedVisibleCount((prev) => {
        const delta = visiblePointCount - prev;
        if (Math.abs(delta) < 2) return visiblePointCount;
        return prev + Math.sign(delta) * Math.ceil(Math.abs(delta) * 0.2);
      });
      if (animatedVisibleCount !== visiblePointCount)
        animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [visiblePointCount]);

  /* ── sonar ping ── */
  useEffect(() => {
    if (pingRef.current) {
      pingRef.current.classList.remove('ping', 'loadingPulse');
      void pingRef.current.offsetWidth;
      pingRef.current.classList.add(occurrenceLoading ? 'loadingPulse' : 'ping');
    }
  }, [visiblePointCount, occurrenceLoading]);

  /* ── redux ── */
  const filters        = useAppSelector((state) => state.map.filters);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);
  const dispatch       = useAppDispatch();

  const filteredOccurrenceData = React.useMemo(() => {
    const speciesFilter    = filters.species?.value;
    const hasSpeciesFilter = Array.isArray(speciesFilter) && speciesFilter.length > 0;
    if (!hasSpeciesFilter) return occurrenceData;
    return occurrenceData.filter((o) =>
      (speciesFilter as string[]).some((fsp: string) => normalize(fsp) === normalize(o.species))
    );
  }, [occurrenceData, filters.species, normalize]);

  const OTHER_LABEL    = 'others';
  const isKnownSpecies = (sp: string) => {
    const style = speciesStyles.find((s) => normalize(s.species) === sp);
    return style && style.color !== GENERIC_GREEN;
  };

  const totalFilteredPoints = filteredOccurrenceData.length;

  const {
    knownCounts, unknownCounts,
    knownPresenceCounts, knownAbsenceCounts,
    unknownPresenceCounts, unknownAbsenceCounts,
    totalPresenceCount, totalAbsenceCount,
  } = React.useMemo(() => {
    const known: Record<string, number> = {};
    const unknown: Record<string, number> = {};
    const knownPresence: Record<string, number> = {};
    const knownAbsence: Record<string, number> = {};
    const unknownPresence: Record<string, number> = {};
    const unknownAbsence: Record<string, number> = {};
    let totalPresence = 0, totalAbsence = 0;

    filteredOccurrenceData.forEach((o) => {
      const sp     = normalize(o.species ?? 'unknown');
      const status = getPresenceStatus((o as any).binary_presence);
      if (isKnownSpecies(sp)) {
        known[sp] = (known[sp] ?? 0) + 1;
        if (status === 'absence') { knownAbsence[sp]  = (knownAbsence[sp]  ?? 0) + 1; totalAbsence  += 1; }
        else                      { knownPresence[sp] = (knownPresence[sp] ?? 0) + 1; totalPresence += 1; }
      } else {
        unknown[sp] = (unknown[sp] ?? 0) + 1;
        if (status === 'absence') { unknownAbsence[sp]  = (unknownAbsence[sp]  ?? 0) + 1; totalAbsence  += 1; }
        else                      { unknownPresence[sp] = (unknownPresence[sp] ?? 0) + 1; totalPresence += 1; }
      }
    });

    return {
      knownCounts: known, unknownCounts: unknown,
      knownPresenceCounts: knownPresence, knownAbsenceCounts: knownAbsence,
      unknownPresenceCounts: unknownPresence, unknownAbsenceCounts: unknownAbsence,
      totalPresenceCount: totalPresence, totalAbsenceCount: totalAbsence,
    };
  }, [filteredOccurrenceData, normalize, speciesStyles]);

  const visiblePresenceCount = showDetected    ? totalPresenceCount : 0;
  const visibleAbsenceCount  = showNotDetected ? totalAbsenceCount  : 0;
  const othersCount = Object.values(unknownCounts).reduce((a, b) => a + b, 0);

  const sortedFilteredSpecies = React.useMemo(() => {
    const entries = Object.entries(knownCounts).sort((a, b) => b[1] - a[1]);
    if (othersCount > 0) entries.push([OTHER_LABEL, othersCount]);
    return entries;
  }, [knownCounts, othersCount]);

  const donutData = sortedFilteredSpecies.slice(0, 9).map(([sp, count]) => {
    if (sp === OTHER_LABEL) return { name: 'Other Anopheles', value: count, color: '#038543' };
    const style = speciesStyles.find((s) => normalize(s.species) === sp);
    return { name: sp, value: count, color: style?.color ?? '#888' };
  });

  useEffect(() => {
    if (activeSpecies && speciesRowRefs.current[normalize(activeSpecies)]) {
      speciesRowRefs.current[normalize(activeSpecies)]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSpecies, panelOpen]);

  interface TimeRange { start: number | null; end: number | null; }
  const isTimeRange = (value: any): value is TimeRange =>
    value && typeof value === 'object' && 'start' in value && 'end' in value;

  const activeFilters = useAppSelector((state) => {
    const f = state.map.filters;
    return Object.entries(f).filter(([key, filter]) => {
      if (key === 'timeRange' && isTimeRange(filter.value))
        return filter.value.start !== null || filter.value.end !== null;
      return Array.isArray(filter.value) && filter.value.length > 0;
    });
  });

  const hasActiveFilters       = activeFilters.length > 0;
  const zeroResultsFromFilters = hasActiveFilters && visiblePointCount === 0 && !occurrenceLoading;

  /* ── tooltip ── */
  const CustomDonutTooltip = ({ active, payload }: any) => {
    const data = active && payload?.length
      ? payload[0].payload
      : touchedSpecies ? donutData.find((d) => d.name === touchedSpecies) : null;
    if (!data) return null;
    const displayName = data.name === 'Other Anopheles'
      ? data.name : `An. ${getSpeciesDisplayName(data.name)}`;
    return (
      <Box sx={{ background: 'rgba(10,15,20,0.95)', borderRadius: 2, px: 1, py: 0.5 }}>
        <Typography fontSize={11} fontWeight={700} fontStyle="italic">{displayName}</Typography>
        <Typography fontSize={11} color="#7EEFA8" fontWeight={800}>{data.value.toLocaleString()}</Typography>
      </Box>
    );
  };

  /* ─── which "expanded" flag applies per layout ─────────────────────────── */
  const isExpanded = isMobile ? mobileSheetOpen : panelOpen;
  const pieW = isMobile ? 140 : isTablet ? 140 : 160;
  const pieH = isMobile ? 105 : isTablet ? 105 : 120;
  const innerR = isTablet ? 32 : 38;
  const outerR = isTablet ? 46 : 54;

  /* ─── shared body content (used in both layouts) ──────────────────────── */
  const PanelBody = () => (
    <>
      {zeroResultsFromFilters && (
        <Box mt={1} p={1.2} borderRadius={2}
          sx={{ background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.35)', textAlign: 'center' }}>
          <Typography fontSize={11} fontWeight={800} color="#ff4d4d">
            ❌ No records match current filter settings
          </Typography>
        </Box>
      )}

      {/* Donut — only when expanded */}
      {isExpanded && (
        <Box display="flex" justifyContent="center" mt={1}>
          <Box sx={{ position: 'relative' }}>
            <PieChart width={pieW} height={pieH}>
              <Tooltip content={<CustomDonutTooltip />} />
              <Pie data={donutData} dataKey="value" innerRadius={innerR} outerRadius={outerR} paddingAngle={3}>
                {donutData.map((d, i) => (
                  <Cell key={i} fill={d.color}
                    onClick={() => {
                      setTouchedSpecies(d.name);
                      if (hideTooltipTimer.current) clearTimeout(hideTooltipTimer.current);
                      hideTooltipTimer.current = setTimeout(() => {
                        setTouchedSpecies(null); hideTooltipTimer.current = null;
                      }, 3000);
                    }}
                    onMouseEnter={() => setHoveredSpecies(d.name)}
                    onMouseLeave={() => setHoveredSpecies(null)}
                    style={{
                      cursor: 'pointer',
                      filter: touchedSpecies === d.name || hoveredSpecies === d.name
                        ? 'drop-shadow(0 0 6px rgba(0,255,128,0.6))' : 'none',
                      transition: 'filter 0.2s',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
            {touchedSpecies && (
              <Box sx={{ position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%,-50%)', background: 'rgba(10,15,20,0.95)',
                borderRadius: 2, px: 1, py: 0.5, zIndex: 30, pointerEvents: 'none' }}>
                <Typography fontSize={11} fontWeight={700} fontStyle="italic">
                  {touchedSpecies === 'Other Anopheles'
                    ? touchedSpecies : `An. ${getSpeciesDisplayName(touchedSpecies)}`}
                </Typography>
                <Typography fontSize={11} color="#7EEFA8" fontWeight={800}>
                  {donutData.find((d) => d.name === touchedSpecies)?.value.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Visible count */}
      {totalFilteredPoints > 0 && (
        <Box textAlign="center" mt={isExpanded ? -1 : 0.5}>
          <Typography fontSize={9} sx={{ opacity: 0.6 }}>👁️ Visible Occurrence Records</Typography>
          <Typography fontSize={isMobile ? 20 : isTablet ? 18 : 22} fontWeight={900} color="#7EEFA8">
            {visiblePointCount.toLocaleString()}
          </Typography>
        </Box>
      )}

      {/* Detected / Not detected toggles */}
      {totalFilteredPoints > 0 && (
        <>
          {isExpanded && (
            <Typography fontSize={9} sx={{ opacity: 0.6, textAlign: 'center', mt: 1, mb: 0.5 }}>
              Click a card to toggle map visibility
            </Typography>
          )}

          <Box mt={isExpanded ? 1 : 0.5} display="flex" justifyContent="center"
            gap={isMobile ? 0.75 : 1} flexWrap={isMobile ? 'nowrap' : 'wrap'}>

            {/* Detected card */}
            <Box onClick={() => setShowDetected((p) => !p)} role="button" aria-pressed={showDetected}
              sx={{
                px: isMobile ? 1 : 1.2, py: isMobile ? 0.6 : 0.8,
                borderRadius: 2, cursor: 'pointer',
                flex: isMobile ? 1 : 'none',
                minWidth: isMobile ? 0 : isTablet ? 100 : 120,
                background: showDetected ? 'rgba(126,239,168,0.16)' : 'rgba(255,255,255,0.035)',
                border: showDetected ? '1px solid rgba(126,239,168,0.65)' : '1px dashed rgba(255,255,255,0.18)',
                boxShadow: showDetected ? '0 0 18px rgba(126,239,168,0.18)' : 'none',
                transition: 'all 0.2s ease', opacity: showDetected ? 1 : 0.72,
                '&:hover': { transform: 'translateY(-1px)' },
              }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography fontSize={isMobile ? 9 : 10} fontWeight={800}
                  color={showDetected ? '#7EEFA8' : 'rgba(255,255,255,0.65)'}>● Detected</Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography fontSize={8} fontWeight={900}
                    sx={{ px: 0.6, py: 0.1, borderRadius: 1,
                      background: showDetected ? 'rgba(126,239,168,0.18)' : 'rgba(255,255,255,0.08)',
                      color: showDetected ? '#7EEFA8' : 'rgba(255,255,255,0.55)' }}>
                    {showDetected ? 'ON' : 'OFF'}
                  </Typography>
                  {showDetected
                    ? <VisibilityIcon sx={{ fontSize: 13, color: '#7EEFA8' }} />
                    : <VisibilityOffIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }} />}
                </Box>
              </Box>
              <Typography fontSize={12} fontWeight={800}
                color={showDetected ? '#7EEFA8' : 'rgba(255,255,255,0.45)'}>
                {visiblePresenceCount.toLocaleString()}
              </Typography>
            </Box>

            {/* Not detected card */}
            <Box onClick={() => setShowNotDetected((p) => !p)} role="button" aria-pressed={showNotDetected}
              sx={{
                px: isMobile ? 1 : 1.2, py: isMobile ? 0.6 : 0.8,
                borderRadius: 2, cursor: 'pointer',
                flex: isMobile ? 1 : 'none',
                minWidth: isMobile ? 0 : isTablet ? 100 : 120,
                background: showNotDetected ? 'rgba(255,204,128,0.16)' : 'rgba(255,255,255,0.035)',
                border: showNotDetected ? '1px solid rgba(255,204,128,0.65)' : '1px dashed rgba(255,255,255,0.18)',
                boxShadow: showNotDetected ? '0 0 18px rgba(255,204,128,0.16)' : 'none',
                transition: 'all 0.2s ease', opacity: showNotDetected ? 1 : 0.72,
                '&:hover': { transform: 'translateY(-1px)' },
              }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography fontSize={isMobile ? 9 : 10} fontWeight={800}
                  color={showNotDetected ? '#ffcc80' : 'rgba(255,255,255,0.65)'}>▲ Not detected</Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography fontSize={8} fontWeight={900}
                    sx={{ px: 0.6, py: 0.1, borderRadius: 1,
                      background: showNotDetected ? 'rgba(255,204,128,0.18)' : 'rgba(255,255,255,0.08)',
                      color: showNotDetected ? '#ffcc80' : 'rgba(255,255,255,0.55)' }}>
                    {showNotDetected ? 'ON' : 'OFF'}
                  </Typography>
                  {showNotDetected
                    ? <VisibilityIcon sx={{ fontSize: 13, color: '#ffcc80' }} />
                    : <VisibilityOffIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }} />}
                </Box>
              </Box>
              <Typography fontSize={12} fontWeight={800}
                color={showNotDetected ? '#ffcc80' : 'rgba(255,255,255,0.45)'}>
                {visibleAbsenceCount.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {/* Species list — only when fully expanded */}
      {isExpanded && (
        <>
          <Typography fontSize={isTablet ? 10 : 11} fontWeight={800} sx={{ opacity: 0.7, mt: 2, mb: 1 }}>
            Vectors on Map
          </Typography>

          <Box maxHeight={isMobile ? 200 : isTablet ? 180 : 220} overflow="auto"
            sx={{ position: 'relative',
              '&::-webkit-scrollbar': { width: 3 },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(126,239,168,0.25)', borderRadius: 4 } }}>
            {sortedFilteredSpecies.map(([sp, count]: [string, number]) => {
              const normalizedSp = normalize(sp);
              const style = normalizedSp === OTHER_LABEL
                ? { color: '#038543' }
                : speciesStyles.find((s) => normalize(s.species) === normalizedSp);
              const isHovered = hoveredSpecies === normalizedSp;
              const otherPresenceTotal = Object.values(unknownPresenceCounts).reduce((a, b) => a + b, 0);
              const otherAbsenceTotal  = Object.values(unknownAbsenceCounts).reduce((a, b) => a + b, 0);

              return (
                <React.Fragment key={sp}>
                  <Box
                    ref={(el) => { if (el instanceof HTMLDivElement) speciesRowRefs.current[normalizedSp] = el; }}
                    onMouseEnter={() => setHoveredSpecies(normalizedSp)}
                    onMouseLeave={() => setHoveredSpecies(null)}
                    onClick={() => normalizedSp === OTHER_LABEL && setOthersExpanded((p) => !p)}
                    sx={{
                      cursor: normalizedSp === OTHER_LABEL ? 'pointer' : 'default',
                      position: normalizedSp === OTHER_LABEL ? 'sticky' : 'relative',
                      top: 0, zIndex: normalizedSp === OTHER_LABEL ? 15 : 1,
                      mb: 1, p: isMobile ? 0.75 : isTablet ? 0.75 : 1,
                      borderRadius: 2, overflow: 'hidden',
                      background: isHovered ? 'rgba(26,31,36)' : 'rgba(15,20,25,0.95)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${style?.color ?? 'rgba(255,255,255,0.1)'}`,
                    }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${(count / Math.max(totalFilteredPoints, 1)) * 100}%`,
                      background: `linear-gradient(90deg, ${style?.color}, transparent)`,
                      opacity: 0.25,
                    }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center"
                      position="relative" zIndex={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%',
                          background: style?.color, flexShrink: 0 }} />
                        <Typography fontSize={isMobile ? 10 : isTablet ? 10 : 12}
                          fontWeight={700} fontStyle="italic" noWrap>
                          {normalizedSp === OTHER_LABEL ? 'Other Anopheles' : 'An. ' + getSpeciesDisplayName(sp)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box textAlign="right">
                          <Typography fontSize={isMobile ? 10 : isTablet ? 10 : 12} fontWeight={800}>{count}</Typography>
                          <Typography fontSize={9} sx={{ opacity: 0.75 }}>
                            ● {normalizedSp === OTHER_LABEL ? otherPresenceTotal : knownPresenceCounts[normalizedSp] ?? 0}
                            {'  '}▲ {normalizedSp === OTHER_LABEL ? otherAbsenceTotal : knownAbsenceCounts[normalizedSp] ?? 0}
                          </Typography>
                        </Box>
                        {normalizedSp === OTHER_LABEL && (
                          othersExpanded
                            ? <ExpandMoreIcon sx={{ fontSize: 14 }} />
                            : <ChevronRightIcon sx={{ fontSize: 14 }} />
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {normalizedSp === OTHER_LABEL && othersExpanded && (
                    <Box ref={sublistRef} onScroll={handleSublistScroll}
                      sx={{ ml: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <IconButton size="small"
                        onClick={() => speciesRowRefs.current[OTHER_LABEL]?.parentElement?.scrollTo({ top: 0, behavior: 'smooth' })}
                        sx={{ position: 'sticky', top: 45, alignSelf: 'flex-end', zIndex: 20,
                          opacity: showJumpTop ? 1 : 0, pointerEvents: showJumpTop ? 'auto' : 'none',
                          background: 'rgba(10,15,20,0.9)', border: '1px solid #7EEFA8',
                          color: '#7EEFA8', mb: -4, mr: 1, transition: '0.3s' }}>
                        <ExpandLessIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      {Object.entries(unknownCounts).sort((a, b) => b[1] - a[1]).map(([usp, ucount], index) => (
                        <Box key={`${usp}-${index}`}
                          sx={{ display: 'flex', justifyContent: 'space-between',
                            px: 2, py: 1, borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            borderLeft: '3px solid rgba(126,239,168,0.5)' }}>
                          <Typography fontSize={10} fontStyle="italic">An. {usp}</Typography>
                          <Box textAlign="right">
                            <Typography fontSize={10} fontWeight={800} color="#7EEFA8">{ucount}</Typography>
                            <Typography fontSize={9} sx={{ opacity: 0.75 }}>
                              ● {unknownPresenceCounts[usp] ?? 0} {'  '}▲ {unknownAbsenceCounts[usp] ?? 0}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </React.Fragment>
              );
            })}
          </Box>
        </>
      )}
    </>
  );

  /* ═══════════════════════════════════════════════════════════════════════
     MOBILE LAYOUT — fixed bottom sheet, map fully visible behind it
  ═══════════════════════════════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <>
        {/* ── Small loading badge — top-right corner, never covers the map ── */}
        {occurrenceLoading && (
          <Box sx={{
            position: 'fixed', top: 14, right: 14, zIndex: 9998,
            display: 'flex', alignItems: 'center', gap: 1,
            px: 1.5, py: 0.75, borderRadius: 20,
            background: 'rgba(10,15,20,0.85)',
            border: '1px solid rgba(126,239,168,0.4)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 16px rgba(126,239,168,0.22)',
            pointerEvents: 'none',
          }}>
            <Box sx={{
              width: 8, height: 8, borderRadius: '50%', background: '#7EEFA8',
              boxShadow: '0 0 8px 2px rgba(126,239,168,0.7)',
              animation: 'dotPulse 1.4s ease-in-out infinite',
            }} />
            <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
              color: '#7EEFA8', textTransform: 'uppercase' }}>
              Loading…
            </Typography>
          </Box>
        )}

        {/* ── Bottom sheet ── */}
        <Box sx={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 9990,
          /* slides between a 68 px peek bar and 75 vh full sheet */
          maxHeight: mobileSheetOpen ? '75vh' : '68px',
          overflow: 'hidden',
          transition: 'max-height 0.38s cubic-bezier(0.4,0,0.2,1)',
          borderRadius: '18px 18px 0 0',
          background: 'rgba(10,15,20,0.88)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(126,239,168,0.18)',
          borderBottom: 'none',
          boxShadow: '0 -6px 36px rgba(126,239,168,0.12), inset 0 0 20px rgba(0,0,0,0.5)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* Drag handle row — always visible, tapping it toggles sheet */}
          <Box onClick={() => setMobileSheetOpen((v) => !v)}
            sx={{ px: 2, pt: 1, pb: 0.75, cursor: 'pointer', flexShrink: 0, userSelect: 'none' }}>
            {/* pill */}
            <Box sx={{ width: 36, height: 4, borderRadius: 2,
              background: 'rgba(126,239,168,0.3)', mx: 'auto', mb: 1 }} />

            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                {/* mini sonar dot */}
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  border: '1.5px solid rgba(126,239,168,0.6)',
                  animation: 'sonarPing 2s ease-out infinite' }} />
                <Typography fontWeight={800} fontSize={11} letterSpacing={1.5} color="#7EEFA8">
                  VECTOR PANEL
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5}>
                {/* quick-glance count always visible in peek bar */}
                <Box display="flex" alignItems="center" gap={0.75}>
                  {occurrenceLoading && (
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#7EEFA8',
                      animation: 'dotPulse 1.4s ease-in-out infinite',
                      boxShadow: '0 0 5px rgba(126,239,168,0.8)' }} />
                  )}
                  <Typography fontSize={13} fontWeight={900} color="#7EEFA8">
                    {visiblePointCount.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 24, height: 24, borderRadius: '50%',
                  border: '1px solid rgba(126,239,168,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#7EEFA8',
                  transform: mobileSheetOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.35s',
                }}>
                  <ExpandLessIcon sx={{ fontSize: 16 }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Scrollable expanded content */}
          <Box sx={{
            overflowY: 'auto', flexGrow: 1, px: 2, pb: 3,
            '&::-webkit-scrollbar': { width: 3 },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(126,239,168,0.25)', borderRadius: 4 },
          }}>
            <PanelBody />
          </Box>
        </Box>

        <style>{`
          @keyframes dotPulse {
            0%,100% { transform: scale(0.85); opacity: 0.7; }
            50%      { transform: scale(1.25); opacity: 1; }
          }
          @keyframes sonarPing {
            0%   { transform: scale(0.4); opacity: 0.9; }
            100% { transform: scale(2.5); opacity: 0; }
          }
        `}</style>
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     TABLET + DESKTOP LAYOUT — original floating right-side panel
  ═══════════════════════════════════════════════════════════════════════ */
  const panelWidth = isTablet ? 260 : panelOpen ? 320 : 200;
  const panelRight = isTablet ? 8 : selectedIdsLength > 0 ? 412 : 12;
  const panelTop   = isTablet ? 80 : 120;

  return (
    <div style={{
      position: 'absolute',
      right: panelRight,
      top: panelTop,
      width: panelWidth,
      padding: isTablet ? 10 : 14,
      borderRadius: 20,
      backdropFilter: 'blur(18px)',
      background: 'rgba(10,15,20,0.75)',
      border: '1px solid rgba(126,239,168,0.18)',
      boxShadow: '0 0 40px rgba(126,239,168,0.15), inset 0 0 20px rgba(0,0,0,0.6)',
      color: 'white',
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 20,
      overflow: 'hidden',
      maxHeight: isTablet ? '72vh' : '80vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div className="radar" />
      <div ref={pingRef} className="sonar" />

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ flexShrink: 0 }}>
        <Typography fontWeight={800} fontSize={isTablet ? 11 : 13} letterSpacing={1}>
          VECTOR PANEL
        </Typography>
        <IconButton onClick={() => setPanelOpen((v) => !v)} size="small"
          sx={{ color: '#7EEFA8', transform: panelOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}>
          <ExpandLessIcon />
        </IconButton>
      </Box>

      {/* Scrollable body */}
      <Box sx={{ overflowY: 'auto', flexGrow: 1,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(126,239,168,0.3)', borderRadius: 4 } }}>
        <PanelBody />
      </Box>

      <style>{`
        .radar {
          position: absolute; inset: -60px; border-radius: 50%;
          border: 1px solid rgba(126,239,168,0.12);
          animation: spin 18s linear infinite; pointer-events: none;
        }
        .sonar {
          position: absolute; inset: 40%; border-radius: 50%;
          border: 2px solid rgba(126,239,168,0.6); opacity: 0; pointer-events: none;
        }
        .sonar.ping         { animation: ping 1.5s ease-out; }
        .sonar.loadingPulse { animation: pulse 2s ease-in-out infinite; opacity: 0.3; }
        @keyframes spin  { from { transform: rotate(0) }   to { transform: rotate(360deg) } }
        @keyframes ping  { 0% { transform: scale(0.2); opacity: 0.8 } 100% { transform: scale(6); opacity: 0 } }
        @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.3 } 50% { transform: scale(1.2); opacity: 0.6 } 100% { transform: scale(0.8); opacity: 0.3 } }
      `}</style>
    </div>
  );
};

export default MapHUD;