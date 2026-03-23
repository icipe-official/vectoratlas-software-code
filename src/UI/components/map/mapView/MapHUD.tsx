import React, { useEffect, useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography, IconButton } from '@mui/material';
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
}) => {
  const speciesDisplayMap: Record<string, string> = {
    'coluzzii_gambiae_m form': ' coluzzii',
    'gambiae_s form': ' gambiae',
    'gambiae_s form_m form': ' gambiae/ coluzzii',
  };

  const getPresenceStatus = (
    value: unknown
  ): 'presence' | 'absence' | 'unknown' => {
    const v = String(value ?? '')
      .toLowerCase()
      .trim();

    if (v === '1' || v === 'true' || v === 'presence' || v === 'present') {
      return 'presence';
    }

    if (v === '0' || v === 'false' || v === 'absence' || v === 'absent') {
      return 'absence';
    }

    return 'unknown';
  };

  const [showJumpTop, setShowJumpTop] = useState(false);

  const handleSublistScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowJumpTop(scrollTop > 100);
  };

  const getSpeciesDisplayName = (rawSpecies: string): string => {
    const match = Object.keys(speciesDisplayMap).find(
      (key) => normalize(key) === rawSpecies || key === rawSpecies
    );
    return match ? speciesDisplayMap[match] : `${rawSpecies}`;
  };

  const [animatedVisibleCount, setAnimatedVisibleCount] = useState(0);
  const pingRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [othersExpanded, setOthersExpanded] = useState(false);
  const [touchedSpecies, setTouchedSpecies] = useState<string | null>(null);
  const sublistRef = useRef<HTMLDivElement | null>(null);
  const hideTooltipTimer = useRef<NodeJS.Timeout | null>(null);

  // ===== SMOOTH CATCH-UP COUNT =====
  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const animate = () => {
      setAnimatedVisibleCount((prev) => {
        const delta = visiblePointCount - prev;
        if (Math.abs(delta) < 2) return visiblePointCount;
        return prev + Math.sign(delta) * Math.ceil(Math.abs(delta) * 0.2);
      });
      if (animatedVisibleCount !== visiblePointCount) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [visiblePointCount]);

  // ===== SONAR PULSE & PING =====
  useEffect(() => {
    if (pingRef.current) {
      pingRef.current.classList.remove('ping', 'loadingPulse');
      void pingRef.current.offsetWidth;
      pingRef.current.classList.add(
        occurrenceLoading ? 'loadingPulse' : 'ping'
      );
    }
  }, [visiblePointCount, occurrenceLoading]);

  // ===== Compute species counts for filtered points =====
  const filters = useAppSelector((state) => state.map.filters);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);

  const filteredOccurrenceData = React.useMemo(() => {
    const speciesFilter = filters.species?.value;
    const hasSpeciesFilter =
      Array.isArray(speciesFilter) && speciesFilter.length > 0;

    if (!hasSpeciesFilter) return occurrenceData;

    return occurrenceData.filter((o) =>
      (speciesFilter as string[]).some(
        (fsp: string) => normalize(fsp) === normalize(o.species)
      )
    );
  }, [occurrenceData, filters.species, normalize]);

  const OTHER_LABEL = 'others';

  const isKnownSpecies = (sp: string) => {
    const style = speciesStyles.find((s) => normalize(s.species) === sp);
    return style && style.color !== GENERIC_GREEN;
  };

  const totalFilteredPoints = filteredOccurrenceData.length;

  const {
    knownCounts,
    unknownCounts,
    knownPresenceCounts,
    knownAbsenceCounts,
    unknownPresenceCounts,
    unknownAbsenceCounts,
    totalPresenceCount,
    totalAbsenceCount,
  } = React.useMemo(() => {
    const known: Record<string, number> = {};
    const unknown: Record<string, number> = {};

    const knownPresence: Record<string, number> = {};
    const knownAbsence: Record<string, number> = {};
    const unknownPresence: Record<string, number> = {};
    const unknownAbsence: Record<string, number> = {};

    let totalPresence = 0;
    let totalAbsence = 0;

    filteredOccurrenceData.forEach((o) => {
      const sp = normalize(o.species ?? 'unknown');
      const status = getPresenceStatus((o as any).binary_presence);

      if (isKnownSpecies(sp)) {
        known[sp] = (known[sp] ?? 0) + 1;

        if (status === 'absence') {
          knownAbsence[sp] = (knownAbsence[sp] ?? 0) + 1;
          totalAbsence += 1;
        } else {
          knownPresence[sp] = (knownPresence[sp] ?? 0) + 1;
          totalPresence += 1;
        }
      } else {
        unknown[sp] = (unknown[sp] ?? 0) + 1;

        if (status === 'absence') {
          unknownAbsence[sp] = (unknownAbsence[sp] ?? 0) + 1;
          totalAbsence += 1;
        } else {
          unknownPresence[sp] = (unknownPresence[sp] ?? 0) + 1;
          totalPresence += 1;
        }
      }
    });

    return {
      knownCounts: known,
      unknownCounts: unknown,
      knownPresenceCounts: knownPresence,
      knownAbsenceCounts: knownAbsence,
      unknownPresenceCounts: unknownPresence,
      unknownAbsenceCounts: unknownAbsence,
      totalPresenceCount: totalPresence,
      totalAbsenceCount: totalAbsence,
    };
  }, [filteredOccurrenceData, normalize, speciesStyles]);

  const othersCount = Object.values(unknownCounts).reduce((a, b) => a + b, 0);

  const allSpeciesCounts = {
    ...knownCounts,
    ...(othersCount > 0 ? { [OTHER_LABEL]: othersCount } : {}),
  };

  const sortedFilteredSpecies = React.useMemo(() => {
    const entries = Object.entries(knownCounts).sort((a, b) => b[1] - a[1]);

    if (othersCount > 0) {
      entries.push([OTHER_LABEL, othersCount]);
    }

    return entries;
  }, [knownCounts, othersCount]);

  const top9Filtered = sortedFilteredSpecies.slice(0, 9);

  const donutData = top9Filtered.map(([sp, count]) => {
    if (sp === OTHER_LABEL) {
      return {
        name: 'Other Anopheles',
        value: count,
        color: '#038543',
      };
    }

    const style = speciesStyles.find((s) => normalize(s.species) === sp);
    return { name: sp, value: count, color: style?.color ?? '#888' };
  });

  // ===== AUTO SCROLL TO ACTIVE SPECIES =====
  useEffect(() => {
    if (activeSpecies && speciesRowRefs.current[normalize(activeSpecies)]) {
      speciesRowRefs.current[normalize(activeSpecies)]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSpecies, panelOpen]);

  const dispatch = useAppDispatch();

  interface TimeRange {
    start: number | null;
    end: number | null;
  }

  const isTimeRange = (value: any): value is TimeRange =>
    value && typeof value === 'object' && 'start' in value && 'end' in value;

  const activeFilters = useAppSelector((state) => {
    const filters = state.map.filters;

    return Object.entries(filters).filter(([key, filter]) => {
      if (key === 'timeRange' && isTimeRange(filter.value)) {
        return filter.value.start !== null || filter.value.end !== null;
      }
      return Array.isArray(filter.value) && filter.value.length > 0;
    });
  });

  const hasActiveFilters = activeFilters.length > 0;

  const zeroResultsFromFilters =
    hasActiveFilters && visiblePointCount === 0 && !occurrenceLoading;

  const CustomDonutTooltip = ({ active, payload }: any) => {
    const data =
      active && payload?.length
        ? payload[0].payload
        : touchedSpecies
          ? donutData.find((d) => d.name === touchedSpecies)
          : null;

    if (!data) return null;

    const displayName =
      data.name === 'Other Anopheles'
        ? data.name
        : `An.  ${getSpeciesDisplayName(data.name)}`;

    return (
      <Box
        sx={{
          background: 'rgba(10,15,20,0.95)',
          borderRadius: 2,
          px: 1,
          py: 0.5,
        }}
      >
        <Typography fontSize={11} fontWeight={700} fontStyle="italic">
          {displayName}
        </Typography>
        <Typography fontSize={11} color="#7EEFA8" fontWeight={800}>
          {data.value.toLocaleString()}
        </Typography>
      </Box>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: selectedIdsLength > 0 ? 412 : 12,
        top: 120,
        width: panelOpen ? 320 : 200,
        padding: 14,
        borderRadius: 20,
        backdropFilter: 'blur(18px)',
        background: 'rgba(10,15,20,0.75)',
        border: '1px solid rgba(126,239,168,0.18)',
        boxShadow:
          '0 0 40px rgba(126,239,168,0.15), inset 0 0 20px rgba(0,0,0,0.6)',
        color: 'white',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      <div className="radar" />
      <div ref={pingRef} className="sonar" />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={800} fontSize={13} letterSpacing={1}>
          VECTOR PANEL
        </Typography>
        <IconButton
          onClick={() => setPanelOpen((v) => !v)}
          size="small"
          sx={{
            color: '#7EEFA8',
            transform: panelOpen ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        >
          <ExpandLessIcon />
        </IconButton>
      </Box>

      {zeroResultsFromFilters && (
        <Box
          mt={1}
          p={1.2}
          borderRadius={2}
          sx={{
            background: 'rgba(255,80,80,0.15)',
            border: '1px solid rgba(255,80,80,0.35)',
            textAlign: 'center',
          }}
        >
          <Typography fontSize={11} fontWeight={800} color="#ff4d4d">
            ❌ No records match current filter settings
          </Typography>
        </Box>
      )}

      {panelOpen && (
        <Box display="flex" justifyContent="center" mt={1}>
          <Box sx={{ position: 'relative' }}>
            <PieChart width={160} height={120}>
              <Tooltip content={<CustomDonutTooltip />} />
              <Pie
                data={donutData}
                dataKey="value"
                innerRadius={38}
                outerRadius={54}
                paddingAngle={3}
              >
                {donutData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.color}
                    onClick={() => {
                      setTouchedSpecies(d.name);
                      if (hideTooltipTimer.current)
                        clearTimeout(hideTooltipTimer.current);
                      hideTooltipTimer.current = setTimeout(() => {
                        setTouchedSpecies(null);
                        hideTooltipTimer.current = null;
                      }, 3000);
                    }}
                    onMouseEnter={() => setHoveredSpecies(d.name)}
                    onMouseLeave={() => setHoveredSpecies(null)}
                    style={{
                      cursor: 'pointer',
                      filter:
                        touchedSpecies === d.name || hoveredSpecies === d.name
                          ? 'drop-shadow(0 0 6px rgba(0,255,128,0.6))'
                          : 'none',
                      transition: 'filter 0.2s',
                    }}
                  />
                ))}
              </Pie>{' '}
            </PieChart>

            {touchedSpecies && (
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(10,15,20,0.95)',
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                  zIndex: 30,
                }}
              >
                <Typography fontSize={11} fontWeight={700} fontStyle="italic">
                  {touchedSpecies === 'Other Anopheles>'
                    ? touchedSpecies
                    : `An. ${getSpeciesDisplayName(touchedSpecies)}`}
                </Typography>
                <Typography fontSize={11} color="#7EEFA8" fontWeight={800}>
                  {donutData
                    .find((d) => d.name === touchedSpecies)
                    ?.value.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {totalFilteredPoints > 0 && (
        <Box textAlign="center" mt={-1}>
          <Typography fontSize={10} sx={{ opacity: 0.6 }}>
            👁️ Total Occurrence Records
          </Typography>
          <Typography fontSize={22} fontWeight={900} color="#7EEFA8">
            {totalFilteredPoints.toLocaleString()}
          </Typography>
        </Box>
      )}

      {totalFilteredPoints > 0 && (
        <Box
          mt={1}
          display="flex"
          justifyContent="center"
          gap={1}
          flexWrap="wrap"
        >
          <Box
            sx={{
              px: 1.2,
              py: 0.6,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Typography fontSize={10} sx={{ opacity: 0.7 }}>
              ● Detected
            </Typography>
            <Typography fontSize={13} fontWeight={800} color="#7EEFA8">
              {totalPresenceCount.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.2,
              py: 0.6,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Typography fontSize={10} sx={{ opacity: 0.7 }}>
              ▲ Not detected
            </Typography>
            <Typography fontSize={13} fontWeight={800} color="#ffcc80">
              {totalAbsenceCount.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      )}

      {panelOpen && (
        <>
          <Typography
            fontSize={11}
            fontWeight={800}
            sx={{ opacity: 0.7, mb: 1 }}
          >
            Vectors on Map
          </Typography>

          <Box
            mt={2}
            maxHeight={220}
            overflow="auto"
            sx={{ position: 'relative' }}
          >
            {sortedFilteredSpecies.map(([sp, count]: [string, number]) => {
              const normalizedSp = normalize(sp);
              const style =
                normalizedSp === OTHER_LABEL
                  ? { color: '#038543' }
                  : speciesStyles.find(
                    (s) => normalize(s.species) === normalizedSp
                  );
              const isHovered = hoveredSpecies === normalizedSp;

              const otherPresenceTotal = Object.values(
                unknownPresenceCounts
              ).reduce((a, b) => a + b, 0);
              const otherAbsenceTotal = Object.values(
                unknownAbsenceCounts
              ).reduce((a, b) => a + b, 0);

              return (
                <React.Fragment key={sp}>
                  <Box
                    ref={(el) => {
                      if (el instanceof HTMLDivElement) {
                        speciesRowRefs.current[normalizedSp] = el;
                      }
                    }}
                    onMouseEnter={() => setHoveredSpecies(normalizedSp)}
                    onMouseLeave={() => setHoveredSpecies(null)}
                    onClick={() =>
                      normalizedSp === OTHER_LABEL &&
                      setOthersExpanded((prev) => !prev)
                    }
                    sx={{
                      cursor:
                        normalizedSp === OTHER_LABEL ? 'pointer' : 'default',
                      position:
                        normalizedSp === OTHER_LABEL ? 'sticky' : 'relative',
                      top: 0,
                      zIndex: normalizedSp === OTHER_LABEL ? 15 : 1,
                      mb: 1,
                      p: 1,
                      borderRadius: 2,
                      overflow: 'hidden',
                      background: isHovered
                        ? 'rgba(26, 31, 36)'
                        : 'rgba(15, 20, 25, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${style?.color ?? 'rgba(255,255,255,0.1)'
                        }`,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${(count / Math.max(totalFilteredPoints, 1)) * 100
                          }%`,
                        background: `linear-gradient(90deg, ${style?.color}, transparent)`,
                        opacity: 0.25,
                      }}
                    />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      position="relative"
                      zIndex={2}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: style?.color,
                          }}
                        />
                        <Typography
                          fontSize={12}
                          fontWeight={700}
                          fontStyle="italic"
                        >
                          {normalizedSp === OTHER_LABEL
                            ? 'Other Anopheles'
                            : 'An.  ' + getSpeciesDisplayName(sp)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box textAlign="right">
                          <Typography fontSize={12} fontWeight={800}>
                            {count}
                          </Typography>
                          <Typography fontSize={10} sx={{ opacity: 0.75 }}>
                            ●{' '}
                            {normalizedSp === OTHER_LABEL
                              ? otherPresenceTotal
                              : (knownPresenceCounts[normalizedSp] ?? 0)}
                            {'  '}▲{' '}
                            {normalizedSp === OTHER_LABEL
                              ? otherAbsenceTotal
                              : (knownAbsenceCounts[normalizedSp] ?? 0)}
                          </Typography>
                        </Box>
                        {normalizedSp === OTHER_LABEL &&
                          (othersExpanded ? (
                            <ExpandMoreIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <ChevronRightIcon sx={{ fontSize: 16 }} />
                          ))}
                      </Box>
                    </Box>
                  </Box>

                  {normalizedSp === OTHER_LABEL && othersExpanded && (
                    <Box
                      ref={sublistRef}
                      onScroll={handleSublistScroll}
                      sx={{
                        ml: 2,
                        mb: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        transition: 'all 0.4s ease',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => {
                          speciesRowRefs.current[
                            OTHER_LABEL
                          ]?.parentElement?.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                          });
                        }}
                        sx={{
                          position: 'sticky',
                          top: 45,
                          alignSelf: 'flex-end',
                          zIndex: 20,
                          opacity: showJumpTop ? 1 : 0,
                          pointerEvents: showJumpTop ? 'auto' : 'none',
                          background: 'rgba(10,15,20,0.9)',
                          border: '1px solid #7EEFA8',
                          color: '#7EEFA8',
                          mb: -4,
                          mr: 1,
                          transition: '0.3s',
                        }}
                      >
                        <ExpandLessIcon sx={{ fontSize: 16 }} />
                      </IconButton>

                      {Object.entries(unknownCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([usp, ucount], index) => (
                          <Box
                            key={`${usp}-${index}`}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              px: 2,
                              py: 1,
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderLeft: '3px solid rgba(126, 239, 168, 0.5)',
                            }}
                          >
                            <Typography fontSize={11} fontStyle="italic">
                              An. {usp}
                            </Typography>
                            <Box textAlign="right">
                              <Typography
                                fontSize={11}
                                fontWeight={800}
                                color="#7EEFA8"
                              >
                                {ucount}
                              </Typography>
                              <Typography fontSize={10} sx={{ opacity: 0.75 }}>
                                ● {unknownPresenceCounts[usp] ?? 0} {'  '}▲{' '}
                                {unknownAbsenceCounts[usp] ?? 0}
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
      <style>{`
        .radar {
          position:absolute; inset:-60px;
          border-radius:50%;
          border:1px solid rgba(126,239,168,0.12);
          animation: spin 18s linear infinite;
          pointer-events:none;
        }

        .sonar {
          position:absolute; inset:40%;
          border-radius:50%;
          border:2px solid rgba(126,239,168,0.6);
          opacity:0;
          pointer-events:none;
        }
        .sonar.ping { animation: ping 1.5s ease-out; }
        .sonar.loadingPulse { animation: pulse 2s ease-in-out infinite; opacity:0.3; }

        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ping { 0%{transform:scale(0.2);opacity:0.8} 100%{transform:scale(6);opacity:0} }
        @keyframes pulse { 0%{transform:scale(0.8);opacity:0.3} 50%{transform:scale(1.2);opacity:0.6} 100%{transform:scale(0.8);opacity:0.3} }
      `}</style>
    </div>
  );
};

export default MapHUD;
