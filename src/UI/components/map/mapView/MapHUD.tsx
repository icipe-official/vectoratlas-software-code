import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { speciesStyle } from './types';

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
  const initialLoadRef = useRef(true);

  useEffect(() => {
    let start = animatedVisibleCount;
    const end = visiblePointCount;
    if (start === end) return;

    const isInitialLoad = occurrenceLoading || initialLoadRef.current;

    let rafId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const animateSequentially = () => {
      let current = start;
      const delta = Math.abs(end - start);
      const maxSteps = 1800;
      const stepSize = Math.max(1, Math.floor(delta / maxSteps));

      const tick = () => {
        if (current >= end) {
          setAnimatedVisibleCount(end);
          initialLoadRef.current = false;
          return;
        }

        current = Math.min(current + stepSize, end);
        setAnimatedVisibleCount(current);
        timeoutId = setTimeout(tick, 1);
      };

      tick();
    };

    const animateWithJump = () => {
      const duration = 260;
      const startTime = performance.now();

      const tick = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        const ease = 1 - (1 - t) * (1 - t);
        const value = Math.floor(start + (end - start) * ease);

        setAnimatedVisibleCount(value);

        if (t < 1) rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    };

    isInitialLoad ? animateSequentially() : animateWithJump();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [visiblePointCount, occurrenceLoading]);

  const maxSpecies = Math.max(...Object.values(speciesCounts), 1);

  return (
    <div
      style={{
        position: 'absolute',
        right: selectedIdsLength > 0 ? 412 : 12,
        top: 120,
        width: panelOpen ? 290 : 190,
        padding: panelOpen ? 14 : 10,
        borderRadius: 18,
        backdropFilter: 'blur(18px)',
        background: 'rgba(20,20,20,0.62)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
        color: 'white',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      {/* SOFT LOADING PULSE */}
      {occurrenceLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.04)',
            animation: 'pulse 1.4s ease-in-out infinite',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        zIndex={2}
      >
        <Typography fontWeight={700} fontSize={14} sx={{ opacity: 0.85 }}>
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

      {/* MAIN COUNT */}
      <Box mt={1.4}>
        <Typography fontSize={10} sx={{ opacity: 0.55, fontWeight: 700 }}>
          Available
        </Typography>

        <Typography
          fontSize={20}
          fontWeight={900}
          sx={{
            color: '#7EEFA8',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.4px',
          }}
        >
          {animatedVisibleCount.toLocaleString()}
        </Typography>
      </Box>

      {/* SPECIES LIST */}
      {panelOpen && (
        <Box mt={2} pt={1}>
          <Typography
            fontSize={11}
            fontWeight={700}
            sx={{ opacity: 0.45, mb: 1 }}
          >
            Species Breakdown
          </Typography>

          <Box maxHeight={170} overflow="auto">
            {Object.entries(speciesCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([sp, count]) => {
                const normalizedSp = normalize(sp);
                const style = speciesStyles.find(
                  (s) => normalize(s.species) === normalizedSp
                );

                const percent = (count / maxSpecies) * 100;
                const isHovered = hoveredSpecies === normalizedSp;
                const isSelected = activeSpecies === normalizedSp;

                return (
                  <Box
                    key={sp}
                    ref={(el) => {
                      if (el) speciesRowRefs.current[normalizedSp] = el;
                    }}
                    onMouseEnter={() => setHoveredSpecies(normalizedSp)}
                    onMouseLeave={() => setHoveredSpecies(null)}
                    mb={0.8}
                    p="6px 8px"
                    sx={{
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background:
                        isHovered || isSelected
                          ? 'rgba(255,255,255,0.08)'
                          : 'transparent',
                      transform: isHovered ? 'translateX(4px)' : 'none',
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center" gap={1.2}>
                        {/* COLOR DOT */}
                        <div
                          style={{
                            width: isHovered ? 11 : 9,
                            height: isHovered ? 11 : 9,
                            borderRadius: '50%',
                            background: style?.color ?? '#aaa',
                            boxShadow: isHovered
                              ? `0 0 12px ${style?.color}`
                              : 'none',
                            transition: 'all 0.2s',
                          }}
                        />

                        {/* LABEL */}
                        <Typography fontSize={12}>
                          <span style={{ opacity: 0.35 }}>An.</span>{' '}
                          <span
                            style={{
                              fontStyle: 'italic',
                              fontWeight: isHovered || isSelected ? 700 : 500,
                              color: isHovered ? style?.color : '#fff',
                            }}
                          >
                            {sp}
                          </span>
                        </Typography>
                      </Box>

                      <Typography fontWeight={700} fontSize={12}>
                        {count}
                      </Typography>
                    </Box>

                    {/* MINI BAR */}
                    <Box
                      mt={0.4}
                      height={3}
                      borderRadius={2}
                      sx={{
                        background: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        height="100%"
                        width={`${percent}%`}
                        sx={{
                          background: style?.color ?? '#7EEFA8',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Box>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.65; }
        }
      `}</style>
    </div>
  );
};

export default MapHUD;
