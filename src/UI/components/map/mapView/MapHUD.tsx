import React, { useEffect, useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { speciesStyle } from './types';
import { useAppSelector, useAppDispatch } from '../../../state/hooks';
import { GENERIC_GREEN } from './pointutilswebgl';
import { setFilteredData } from '../../../state/map/mapSlice';

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

const getTimezoneOffset = (value: Date) => value.getTimezoneOffset() * 60000;
const localToUTC = (dateTime: Date) => {
  const utcFromLocal = new Date(
    dateTime.getTime() - getTimezoneOffset(dateTime)
  );
  return utcFromLocal;
};

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
  const theme = useTheme();
  const isLaptopOrBelow = useMediaQuery(theme.breakpoints.down('lg'));
  // NEW: detect mobile breakpoint
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const speciesDisplayMap: Record<string, string> = {
    'coluzzii_gambiae_m form': ' coluzzii',
    'gambiae_s form': ' gambiae',
    'gambiae_s form_m form': ' gambiae/ coluzzii',
  };

  const dispatch = useAppDispatch();

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

  const pingRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [othersExpanded, setOthersExpanded] = useState(false);
  const [touchedSpecies, setTouchedSpecies] = useState<string | null>(null);
  const sublistRef = useRef<HTMLDivElement | null>(null);
  const hideTooltipTimer = useRef<NodeJS.Timeout | null>(null);
  const [animatedLoadedCount, setAnimatedLoadedCount] = useState(0);

  const filters = useAppSelector((state) => state.map.filters);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);
  const filteredData = useAppSelector(
    (state) => state.map.filteredOccurrenceData
  );

  const filteredOccurrenceData = React.useMemo(() => {
    const {
      species,
      country,
      binary_presence,
      isAdult,
      isLarval,
      bionomics,
      timeRange,
      season,
      insecticide,
      control,
      abundance_data,
    } = filters;

    // Quick check: if NO filters are active, return everything to save CPU
    const hasActiveFilters =
      (species?.value?.length ?? 0) > 0 ||
      (country?.value?.length ?? 0) > 0 ||
      (binary_presence?.value?.length ?? 0) > 0 ||
      isAdult?.value?.includes(true) ||
      isLarval?.value?.includes(true) ||
      bionomics?.value?.includes(true) ||
      timeRange?.value?.start !== null ||
      timeRange?.value?.end !== null ||
      (season?.value?.length ?? 0) > 0 ||
      (insecticide?.value?.length ?? 0) > 0 ||
      (control?.value?.length ?? 0) > 0 ||
      (abundance_data?.value?.length ?? 0) > 0;

    if (!hasActiveFilters) return occurrenceData;

    return occurrenceData.filter((o: any) => {
      // 1. Species Filter
      if (species?.value?.length > 0 && !species.value.includes(o.species))
        return false;

      // 2. Country Filter (Case-insensitive)
      if (country?.value && country.value.length > 0) {
        const oCountry = String(o.country || '').toLowerCase();

        // Safely force TypeScript to treat it as an array
        const countryArray = Array.isArray(country.value)
          ? country.value
          : [country.value];
        const selectedCountries = countryArray.map((c: string) =>
          String(c).toLowerCase()
        );

        if (!selectedCountries.includes(oCountry)) return false;
      }

      // 3. Binary Presence (Detected / Not Detected)
      if (binary_presence?.value?.length > 0) {
        const status = getPresenceStatus(o.binary_presence);
        if (status === 'absence' && !binary_presence.value.includes('False'))
          return false;
        if (status === 'presence' && !binary_presence.value.includes('True'))
          return false;
      }

      // 4. Life Stage Filters
      if (isAdult?.value?.includes(true) && !o.is_adult) return false;
      if (isLarval?.value?.includes(true) && !o.is_larval) return false;

      // 5. Bionomics Filter
      //if (bionomics?.value?.includes(true) && !o.has_bionomics && !o.bionomics)
      //  return false;
      if (bionomics?.value?.includes(true) && o.bio_data !== 'True')
        return false;

      // 6. Time Range Filter
      const oYear = localToUTC(new Date(o.year_start, 0)).getTime();
      if (timeRange?.value?.start && oYear < timeRange.value.start)
        return false;
      if (timeRange?.value?.end && oYear > timeRange.value.end) return false;

      // 7. Season Filter
      if (season?.value?.length > 0) {
        const oSeason =
          o.season_val ||
          o.bionomics?.season_calc ||
          o.bionomics?.season_given ||
          '';
        if (!season.value.includes(oSeason)) return false;
      }

      // 8. Insecticide & Control
      if (
        insecticide?.value?.length > 0 &&
        !insecticide.value.includes(o.insecticide)
      )
        return false;
      if (control?.value?.length > 0 && !control.value.includes(o.control))
        return false;

      if (abundance_data?.value?.length > 0 && o.abundance_data !== 'True')
        return false;

      return true; // If it passes all checks, keep it!
    });
  }, [occurrenceData, filters]);

  const OTHER_LABEL = 'others';

  const isKnownSpecies = (sp: string) => {
    const style = speciesStyles.find((s) => normalize(s.species) === sp);
    return style && style.color !== GENERIC_GREEN;
  };

  const totalLoadedPoints = filteredOccurrenceData.length;

  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const animate = () => {
      let done = false;

      setAnimatedLoadedCount((prev) => {
        const delta = totalLoadedPoints - prev;

        if (Math.abs(delta) < 2) {
          done = true;
          return totalLoadedPoints;
        }

        return prev + Math.sign(delta) * Math.ceil(Math.abs(delta) * 0.2);
      });

      if (!done) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [totalLoadedPoints]);

  useEffect(() => {
    dispatch(setFilteredData(filteredOccurrenceData));
  }, [dispatch, filteredOccurrenceData]);

  useEffect(() => {
    if (pingRef.current) {
      pingRef.current.classList.remove('ping', 'loadingPulse');
      void pingRef.current.offsetWidth;
      pingRef.current.classList.add(
        occurrenceLoading ? 'loadingPulse' : 'ping'
      );
    }
  }, [totalLoadedPoints, occurrenceLoading]);

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

  const visiblePresenceCount = showDetected ? totalPresenceCount : 0;
  const visibleAbsenceCount = showNotDetected ? totalAbsenceCount : 0;

  const othersCount = Object.values(unknownCounts).reduce((a, b) => a + b, 0);

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

  useEffect(() => {
    if (activeSpecies && speciesRowRefs.current[normalize(activeSpecies)]) {
      speciesRowRefs.current[normalize(activeSpecies)]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSpecies, panelOpen, normalize, speciesRowRefs]);

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
    hasActiveFilters && totalLoadedPoints === 0 && !occurrenceLoading;

  const isExpanded = panelOpen;

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

  // ─── Responsive positioning ───────────────────────────────────────────────
  // Desktop: fixed top-right corner (original behaviour)
  // Mobile:  fixed bottom sheet — full width, sits above the bottom edge
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        top: 'auto',
        width: '100%',
        // When collapsed show only the header; when expanded show up to 60 vh
        maxHeight: isExpanded ? '60vh' : 66,
        borderRadius: '20px 20px 0 0',
        overflowY: isExpanded ? 'auto' : 'hidden',
        padding: 14,
        backdropFilter: 'blur(18px)',
        background: 'rgba(10,15,20,0.92)',
        border: '1px solid rgba(126,239,168,0.18)',
        borderBottom: 'none',
        boxShadow:
          '0 -4px 40px rgba(126,239,168,0.15), inset 0 0 20px rgba(0,0,0,0.6)',
        color: 'white',
        transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 20,
      }
    : {
        position: 'absolute',
        // right: selectedIdsLength > 0 ? 412 : 12,
        right: 12,
        top: isExpanded ? 12 : 120,
        width: isExpanded ? 320 : 200,
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
      };

  return (
    <div style={panelStyle}>
      {/* Drag handle shown only on mobile to hint that the sheet is swipeable */}
      {isMobile && (
        <Box
          sx={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: 'rgba(126,239,168,0.45)',
            mx: 'auto',
            mb: 1,
          }}
        />
      )}

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
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
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

      {isExpanded && (
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
                      if (hideTooltipTimer.current) {
                        clearTimeout(hideTooltipTimer.current);
                      }
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
              </Pie>
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
                  {touchedSpecies === 'Other Anopheles'
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

      {totalLoadedPoints > 0 && (
        <Box textAlign="center" mt={-1}>
          <Typography fontSize={10} sx={{ opacity: 0.6 }}>
            👁️ Total Loaded Occurrence Records
          </Typography>
          <Typography fontSize={22} fontWeight={900} color="#7EEFA8">
            {animatedLoadedCount.toLocaleString()}
          </Typography>
        </Box>
      )}

      {totalLoadedPoints > 0 && (
        <>
          <Typography
            fontSize={9}
            sx={{ opacity: 0.6, textAlign: 'center', mt: 1, mb: 0.5 }}
          >
            Click a card to toggle map visibility
          </Typography>

          <Box
            mt={1}
            display="flex"
            justifyContent="center"
            gap={1}
            flexWrap="wrap"
          >
            <Box
              onClick={() => setShowDetected((prev) => !prev)}
              role="button"
              aria-pressed={showDetected}
              title={
                showDetected ? 'Detected is visible' : 'Detected is hidden'
              }
              sx={{
                px: 1.2,
                py: 0.8,
                borderRadius: 2,
                background: showDetected
                  ? 'rgba(126,239,168,0.16)'
                  : 'rgba(255,255,255,0.035)',
                border: showDetected
                  ? '1px solid rgba(126,239,168,0.65)'
                  : '1px dashed rgba(255,255,255,0.18)',
                boxShadow: showDetected
                  ? '0 0 18px rgba(126,239,168,0.18)'
                  : 'none',
                cursor: 'pointer',
                // On mobile use flex-grow so both cards share the width evenly
                minWidth: { xs: 0, sm: 120 },
                flex: { xs: '1 1 0', sm: '0 0 auto' },
                transition: 'all 0.2s ease',
                opacity: showDetected ? 1 : 0.72,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  borderColor: showDetected
                    ? 'rgba(126,239,168,0.8)'
                    : 'rgba(255,255,255,0.28)',
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  fontSize={10}
                  fontWeight={800}
                  color={showDetected ? '#7EEFA8' : 'rgba(255,255,255,0.65)'}
                >
                  ● Detected
                </Typography>

                <Box display="flex" alignItems="center" gap={0.6}>
                  <Typography
                    fontSize={9}
                    fontWeight={900}
                    sx={{
                      px: 0.7,
                      py: 0.15,
                      borderRadius: 1,
                      background: showDetected
                        ? 'rgba(126,239,168,0.18)'
                        : 'rgba(255,255,255,0.08)',
                      color: showDetected
                        ? '#7EEFA8'
                        : 'rgba(255,255,255,0.55)',
                    }}
                  >
                    {showDetected ? 'ON' : 'OFF'}
                  </Typography>

                  {showDetected ? (
                    <VisibilityIcon sx={{ fontSize: 15, color: '#7EEFA8' }} />
                  ) : (
                    <VisibilityIcon
                      sx={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}
                    />
                  )}
                </Box>
              </Box>

              <Typography
                fontSize={13}
                fontWeight={800}
                color={showDetected ? '#7EEFA8' : 'rgba(255,255,255,0.45)'}
              >
                {visiblePresenceCount.toLocaleString()}
              </Typography>
            </Box>

            <Box
              onClick={() => setShowNotDetected((prev) => !prev)}
              role="button"
              aria-pressed={showNotDetected}
              title={
                showNotDetected
                  ? 'Not detected is visible'
                  : 'Not detected is hidden'
              }
              sx={{
                px: 1.2,
                py: 0.8,
                borderRadius: 2,
                background: showNotDetected
                  ? 'rgba(255,204,128,0.16)'
                  : 'rgba(255,255,255,0.035)',
                border: showNotDetected
                  ? '1px solid rgba(255,204,128,0.65)'
                  : '1px dashed rgba(255,255,255,0.18)',
                boxShadow: showNotDetected
                  ? '0 0 18px rgba(255,204,128,0.16)'
                  : 'none',
                cursor: 'pointer',
                minWidth: { xs: 0, sm: 120 },
                flex: { xs: '1 1 0', sm: '0 0 auto' },
                transition: 'all 0.2s ease',
                opacity: showNotDetected ? 1 : 0.72,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  borderColor: showNotDetected
                    ? 'rgba(255,204,128,0.8)'
                    : 'rgba(255,255,255,0.28)',
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  fontSize={10}
                  fontWeight={800}
                  color={showNotDetected ? '#ffcc80' : 'rgba(255,255,255,0.65)'}
                >
                  ▲ Not detected
                </Typography>

                <Box display="flex" alignItems="center" gap={0.6}>
                  <Typography
                    fontSize={9}
                    fontWeight={900}
                    sx={{
                      px: 0.7,
                      py: 0.15,
                      borderRadius: 1,
                      background: showNotDetected
                        ? 'rgba(255,204,128,0.18)'
                        : 'rgba(255,255,255,0.08)',
                      color: showNotDetected
                        ? '#ffcc80'
                        : 'rgba(255,255,255,0.55)',
                    }}
                  >
                    {showNotDetected ? 'ON' : 'OFF'}
                  </Typography>

                  {showNotDetected ? (
                    <VisibilityIcon sx={{ fontSize: 15, color: '#ffcc80' }} />
                  ) : (
                    <VisibilityIcon
                      sx={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}
                    />
                  )}
                </Box>
              </Box>

              <Typography
                fontSize={13}
                fontWeight={800}
                color={showNotDetected ? '#ffcc80' : 'rgba(255,255,255,0.45)'}
              >
                {visibleAbsenceCount.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {isExpanded && (
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
                      border: `1px solid ${
                        style?.color ?? 'rgba(255,255,255,0.1)'
                      }`,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${
                          (count / Math.max(totalLoadedPoints, 1)) * 100
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
                              : knownPresenceCounts[normalizedSp] ?? 0}
                            {'  '}▲{' '}
                            {normalizedSp === OTHER_LABEL
                              ? otherAbsenceTotal
                              : knownAbsenceCounts[normalizedSp] ?? 0}
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
