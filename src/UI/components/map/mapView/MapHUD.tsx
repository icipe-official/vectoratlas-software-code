import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { speciesStyle } from './types';

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
  const [animatedVisibleCount, setAnimatedVisibleCount] = useState(0);

  // Smoothly interpolate the total count

  useEffect(() => {
    const start = animatedVisibleCount;
    const end = visiblePointCount;
    if (start === end) return;

    let current = start;
    const totalDelta = Math.abs(end - start);

    // Cap the number of actual increments to prevent freezing
    const maxSteps = 1000; // you can tweak
    const stepSize = Math.max(1, Math.floor(totalDelta / maxSteps));

    const step = () => {
      if (current >= end) {
        setAnimatedVisibleCount(end);
        return;
      }

      current = Math.min(current + stepSize, end);
      setAnimatedVisibleCount(current);

      // Short delay to create live counting effect
      setTimeout(step, 1);
    };

    step();
  }, [visiblePointCount]);

  return (
    <div
      style={{
        position: 'absolute',
        right: selectedIdsLength > 0 ? 412 : 12,
        top: 120,
        width: panelOpen ? 280 : 180,
        padding: panelOpen ? 14 : 10,
        borderRadius: 18,
        backdropFilter: 'blur(18px)',
        background: 'rgba(24,24,24,0.55)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 6px 22px rgba(0,0,0,0.35)',
        color: 'white',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      {/* LOADING SHIMMER OVERLAY */}
      {occurrenceLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            animation: 'shimmer 1.6s infinite linear',
            backgroundSize: '200% 100%',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="relative"
        zIndex={3}
      >
        <Typography
          fontWeight={700}
          fontSize={14}
          sx={{ opacity: occurrenceLoading ? 0.55 : 0.85 }}
        >
          Records in View
        </Typography>
        <IconButton
          onClick={() => setPanelOpen((v) => !v)}
          size="small"
          sx={{
            color: 'rgba(255,255,255,0.85)',
            transform: panelOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s',
          }}
        >
          <ExpandLessIcon />
        </IconButton>
      </Box>

      {/* PRIMARY STATS */}
      <Box
        mt={1.5}
        display="flex"
        flexDirection="column"
        position="relative"
        zIndex={3}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" flexDirection="column">
            <Typography
              fontSize={10}
              sx={{ opacity: 0.5, textTransform: 'uppercase', fontWeight: 700 }}
            >
              Available
            </Typography>
            <Typography
              fontSize={18}
              fontWeight={900}
              sx={{
                color: '#7EEFA8',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
            >
              {animatedVisibleCount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* EXPLANATION BASED ON FILTERS */}
        <Typography
          fontSize={10}
          sx={{ opacity: 0.45, mt: 0.5, lineHeight: 1.2 }}
        ></Typography>
      </Box>
      {/* DETAILED BREAKDOWN */}
      {panelOpen && (
        <Box mt={2} pt={1.5} position="relative" zIndex={3}>
          <Typography
            fontWeight={700}
            fontSize={11}
            mb={1.5}
            sx={{
              opacity: 0.45,
              textTransform: 'uppercase',
              letterSpacing: '0.9px',
            }}
          >
            Species Breakdown
          </Typography>

          <Box
            maxHeight={160}
            overflow="auto"
            sx={{
              px: 0.5,
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
              },
            }}
          >
            {Object.entries(speciesCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([sp, count]) => {
                const normalizedSp = normalize(sp);
                const isSelected = activeSpecies === normalizedSp;
                const isHovered = hoveredSpecies === normalizedSp;
                const style = speciesStyles.find(
                  (s) => normalize(s.species) === normalizedSp
                );

                return (
                  <Box
                    key={sp}
                    ref={(el: HTMLDivElement | null) => {
                      if (el) speciesRowRefs.current[normalizedSp] = el;
                    }}
                    onMouseEnter={() => setHoveredSpecies(normalizedSp)}
                    onMouseLeave={() => setHoveredSpecies(null)}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={0.75}
                    p="6px 8px"
                    sx={{
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      background:
                        isSelected || isHovered
                          ? 'rgba(255,255,255,0.08)'
                          : 'transparent',
                      borderLeft: isSelected
                        ? `3px solid ${style?.color || '#fff'}`
                        : '3px solid transparent',
                      transform: isHovered ? 'translateX(4px)' : 'none',
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1.4}>
                      <div
                        style={{
                          width: isHovered ? 11 : 8,
                          height: isHovered ? 11 : 8,
                          borderRadius: '50%',
                          background: style?.color ?? '#bbb',
                          border: `1.5px solid ${
                            isHovered ? '#fff' : 'rgba(255,255,255,0.4)'
                          }`,
                          boxShadow: isHovered
                            ? `0 0 15px ${style?.color}, 0 0 5px #fff`
                            : isSelected
                            ? `0 0 10px ${style?.color}`
                            : 'none',
                          transition: 'all 0.25s ease-out',
                        }}
                      />
                      <Typography
                        fontSize={12}
                        sx={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '4px',
                        }}
                      >
                        <span style={{ opacity: 0.35, fontWeight: 400 }}>
                          An.
                        </span>
                        <span
                          style={{
                            fontStyle: 'italic',
                            fontWeight: isSelected || isHovered ? 700 : 500,
                            opacity: isSelected || isHovered ? 1 : 0.8,
                            color:
                              isSelected || isHovered
                                ? style?.color
                                : 'rgba(255,255,255,0.95)',
                            textTransform: 'lowercase',
                          }}
                        >
                          {sp}
                        </span>
                      </Typography>
                    </Box>
                    <Typography
                      fontSize={12}
                      fontWeight={700}
                      sx={{
                        fontVariantNumeric: 'tabular-nums',
                        opacity: isHovered ? 1 : 0.7,
                        color: isHovered ? style?.color : 'inherit',
                        transition: 'color 0.2s',
                      }}
                    >
                      {count}
                    </Typography>
                  </Box>
                );
              })}
          </Box>
        </Box>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        `,
        }}
      />
    </div>
  );
};

export default MapHUD;
