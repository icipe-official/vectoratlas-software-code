import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { PieChart, Pie, Cell } from 'recharts';
import { speciesStyle } from './types';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';
import { drawerListToggle } from '../../../state/map/mapSlice';

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

  const getSpeciesDisplayName = (rawSpecies: string): string => {
    const match = Object.keys(speciesDisplayMap).find(
      (key) => normalize(key) === rawSpecies || key === rawSpecies
    );
    return match ? speciesDisplayMap[match] : `${rawSpecies}`;
  };
  const [animatedVisibleCount, setAnimatedVisibleCount] = useState(0);
  const pingRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // ===== SMOOTH CATCH-UP COUNT =====
  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const animate = () => {
      setAnimatedVisibleCount((prev) => {
        const delta = visiblePointCount - prev;
        if (Math.abs(delta) < 2) return visiblePointCount; // snap to target
        return prev + Math.sign(delta) * Math.ceil(Math.abs(delta) * 0.2); // smooth catch-up
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

  // ===== SORT SPECIES FOR DISPLAY BASED ON FILTERED DATA =====

  // ===== Compute species counts for filtered points =====
  const filters = useAppSelector((state) => state.map.filters);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);

  const filteredOccurrenceData = React.useMemo(() => {
    const speciesFilter = filters.species?.value; // Assuming MapFilter has a 'value' field
    const hasSpeciesFilter =
      Array.isArray(speciesFilter) && speciesFilter.length > 0;

    if (!hasSpeciesFilter) return occurrenceData;

    return occurrenceData.filter((o) =>
      (speciesFilter as string[]).some(
        (fsp: string) => normalize(fsp) === normalize(o.species)
      )
    );
  }, [occurrenceData, filters.species, normalize]);

  const totalFilteredPoints = filteredOccurrenceData.length;
  const allSpeciesCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    filteredOccurrenceData.forEach((o) => {
      const sp = normalize(o.species ?? 'unknown');
      counts[sp] = (counts[sp] ?? 0) + 1;
    });
    return counts;
  }, [filteredOccurrenceData, normalize]);

  const sortedFilteredSpecies = Object.entries(allSpeciesCounts).sort(
    (a, b) => b[1] - a[1]
  );

  // Top 9 for donut
  const top9Filtered = sortedFilteredSpecies.slice(0, 9);

  const donutData = top9Filtered.map(([sp, count]) => {
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

  // Type guard for TimeRange
  interface TimeRange {
    start: number | null;
    end: number | null;
  }
  const isTimeRange = (value: any): value is TimeRange =>
    value && typeof value === 'object' && 'start' in value && 'end' in value;

  // Detect active filters
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

  // Determine if zero results are caused by active filters
  const zeroResultsFromFilters =
    hasActiveFilters && visiblePointCount === 0 && !occurrenceLoading;

  // ===== Compute filtered points based on active filters or all points =====

  // ===== Sort species for display =====
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
      {/* RADAR SWEEP */}
      <div className="radar" />

      {/* SONAR PULSE & PING */}
      <div ref={pingRef} className="sonar" />

      {/* HEADER */}
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

      {/* DONUT */}
      {panelOpen && (
        <Box display="flex" justifyContent="center" mt={1}>
          <PieChart width={160} height={120}>
            <Pie
              data={donutData}
              dataKey="value"
              innerRadius={38}
              outerRadius={54}
              paddingAngle={3}
            >
              {donutData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </Box>
      )}

      {/* COUNT */}
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

      {/* SPECIES LIST */}
      {panelOpen && (
        <>
          <Typography
            fontSize={11}
            fontWeight={800}
            sx={{ opacity: 0.7, mb: 1 }}
          >
            Vectors on Map
          </Typography>
          <Box mt={2} maxHeight={220} overflow="auto">
            {sortedFilteredSpecies.map(([sp, count]: [string, number]) => {
              const normalizedSp = normalize(sp);
              const style = speciesStyles.find(
                (s) => normalize(s.species) === normalizedSp
              );
              const isHovered = hoveredSpecies === normalizedSp;
              const isActive = activeSpecies === normalizedSp;

              return (
                <Box
                  key={sp}
                  ref={(el) => {
                    if (el instanceof HTMLDivElement) {
                      speciesRowRefs.current[normalizedSp] = el;
                    }
                  }}
                  onMouseEnter={() => setHoveredSpecies(normalizedSp)}
                  onMouseLeave={() => setHoveredSpecies(null)}
                  sx={{
                    position: 'relative',
                    mb: 1,
                    p: 1,
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: isHovered
                      ? 'rgba(126,239,168,0.12)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${
                      style?.color ?? 'rgba(255,255,255,0.1)'
                    }`,
                  }}
                >
                  {/* ENERGY BAR */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${
                        (count / Math.max(totalFilteredPoints, 1)) * 100
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
                        <span style={{ opacity: 0.5, marginRight: 2 }}>
                          An.
                        </span>
                        {getSpeciesDisplayName(sp)}{' '}
                      </Typography>
                    </Box>
                    <Typography fontSize={12} fontWeight={800}>
                      {count}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </>
      )}
      <style>{`
        /* RADAR SWEEP */
        .radar {
          position:absolute; inset:-60px;
          border-radius:50%;
          border:1px solid rgba(126,239,168,0.12);
          animation: spin 18s linear infinite;
          pointer-events:none;
        }

        /* SONAR PULSE & PING */
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
