import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { PieChart, Pie, Cell } from 'recharts';
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
  const initialLoadRef = useRef(true);
  const pingRef = useRef<HTMLDivElement | null>(null);

  // ===== COUNT ANIMATION =====
  useEffect(() => {
    let start = animatedVisibleCount;
    const end = visiblePointCount;
    if (start === end) return;

    const isInitialLoad = occurrenceLoading || initialLoadRef.current;
    let rafId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const animateSequentially = () => {
      let current = start;
      const totalDelta = end - start;
      const maxSteps = 2000;
      const stepSize = Math.max(1, Math.floor(totalDelta / maxSteps));

      const step = () => {
        if (current >= end) {
          setAnimatedVisibleCount(end);
          initialLoadRef.current = false;
          return;
        }
        current = Math.min(current + stepSize, end);
        setAnimatedVisibleCount(current);
        timeoutId = setTimeout(step, 1);
      };
      step();
    };

    const animateWithJump = () => {
      const duration = 280;
      const startTime = performance.now();

      const animate = (t: number) => {
        const p = Math.min((t - startTime) / duration, 1);
        const ease = 1 - (1 - p) * (1 - p);
        const v = Math.floor(start + (end - start) * ease);
        setAnimatedVisibleCount(v);
        if (p < 1) rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    };

    isInitialLoad ? animateSequentially() : animateWithJump();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [visiblePointCount, occurrenceLoading]);

  // ===== SONAR PULSE & PING =====
  useEffect(() => {
    if (pingRef.current) {
      pingRef.current.classList.remove('ping');
      void pingRef.current.offsetWidth;
      pingRef.current.classList.add(
        occurrenceLoading ? 'loadingPulse' : 'ping'
      );
    }
  }, [visiblePointCount, occurrenceLoading]);

  // ===== AUTOSCROLL & ROW PULSE ON ACTIVE SPECIES =====
  useEffect(() => {
    if (activeSpecies && speciesRowRefs.current[activeSpecies]) {
      const row = speciesRowRefs.current[activeSpecies]!;
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.remove('rowPulse');
      void row.offsetWidth;
      row.classList.add('rowPulse');
    }
  }, [activeSpecies]);

  // ===== DATA PROCESSING =====
  const sortedSpecies = Object.entries(speciesCounts).sort(
    (a, b) => b[1] - a[1]
  );
  const top5 = sortedSpecies.slice(0, 5);
  const others = sortedSpecies.slice(5);
  const dominantSpecies = sortedSpecies[0]?.[0];

  const donutData = top5.map(([sp, count]) => {
    const style = speciesStyles.find(
      (s) => normalize(s.species) === normalize(sp)
    );
    return { name: sp, value: count, color: style?.color ?? '#888' };
  });

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

      {/* DONUT */}
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

      {/* COUNT */}
      <Box textAlign="center" mt={-1}>
        <Typography sx={{ fontSize: 10, opacity: 0.6 }}>
          RECORDS IN VIEW
        </Typography>
        <Typography fontSize={22} fontWeight={900} color="#7EEFA8">
          {animatedVisibleCount.toLocaleString()}
        </Typography>
      </Box>

      {/* DOMINANT BADGE */}
      {dominantSpecies && (
        <Box
          mt={1}
          p={1}
          borderRadius={2}
          sx={{
            background:
              'linear-gradient(90deg, rgba(255,0,0,0.25), transparent)',
            border: '1px solid rgba(255,0,0,0.4)',
          }}
        >
          <Typography fontSize={11} fontWeight={800} color="#ff6b6b">
            DOMINANT VECTOR: {dominantSpecies}
          </Typography>
        </Box>
      )}

      {/* SPECIES LIST */}
      {panelOpen && (
        <Box mt={2} maxHeight={220} overflow="auto">
          {[...top5, ...others].map(([sp, count]) => {
            const normalizedSp = normalize(sp);
            const style = speciesStyles.find(
              (s) => normalize(s.species) === normalizedSp
            );
            const isHovered = hoveredSpecies === normalizedSp;
            const isActive = activeSpecies === normalizedSp;

            return (
              <Box
                key={sp}
                ref={(el: HTMLDivElement | null) => {
                  if (el) speciesRowRefs.current[normalizedSp] = el;
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
                    : isActive
                    ? 'rgba(126,239,168,0.08)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${
                    style?.color ?? 'rgba(255,255,255,0.1)'
                  }`,
                }}
                className={isActive ? 'rowPulse' : ''}
              >
                {/* ENERGY BAR */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${(count / animatedVisibleCount) * 100}%`,
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
                      <span style={{ opacity: 0.5, marginRight: 2 }}>An.</span>
                      {sp}
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

        .rowPulse {
          animation: highlightRow 1.5s ease-in-out;
        }

        @keyframes highlightRow {
          0% { background-color: rgba(126,239,168,0.15); }
          50% { background-color: rgba(126,239,168,0.35); }
          100% { background-color: rgba(126,239,168,0.15); }
        }

        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ping { 0%{transform:scale(0.2);opacity:0.8} 100%{transform:scale(6);opacity:0} }
        @keyframes pulse { 0%{transform:scale(0.8);opacity:0.3} 50%{transform:scale(1.2);opacity:0.6} 100%{transform:scale(0.8);opacity:0.3} }
      `}</style>
    </div>
  );
};

export default MapHUD;
