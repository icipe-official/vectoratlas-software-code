import { SkipPrevious, PlayArrow, SkipNext, Replay, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, IconButton, Paper, Slider, Stack, styled, Typography, ToggleButton, ToggleButtonGroup, CircularProgress, Button, useMediaQuery } from '@mui/material';
import { Pause } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { addMonths, addYears, getDaysInMonth, startOfMonth, startOfYear, format, setDate, setMonth, setYear, parseISO, isValid, isBefore, isAfter } from 'date-fns';
import theme from '../../../styles/theme';

export interface DateTimeSliderProps {
  startDateTime?: string;
  endDateTime?: string;
  currentDateTime?: string;
  setCurrentDateTime?: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean; // Prop to signal if the parent map is fetching/rendering
  bufferedDateTime?: string; // Prop to indicate how far ahead data is cached/pre-fetched
  compact?: boolean; // Initial state of whether the slider is in compact mode
}

type Resolution = 'day' | 'month' | 'year';

interface TimelineState {
  resolution: Resolution;
  currentContext: Date; // e.g., Oct 1, 2026
  currentStep: number;  // The actual slider value
}

const getSliderBounds = (res: Resolution, ctx: Date) => {
  if (res === 'day') return { min: 1, max: getDaysInMonth(ctx) };
  if (res === 'month') return { min: 0, max: 11 };
  if (res === 'year') return { min: 0, max: 9 }; // 10-year window (decade)
  return { min: 0, max: 0 };
};

const addUnits = (res: Resolution, date: Date, amount: number) => {
  if (res === 'day') return addMonths(date, amount);
  if (res === 'month') return addYears(date, amount);
  return addYears(date, amount * 10);
};

const computeExactDate = (res: Resolution, ctx: Date, step: number) => {
  if (res === 'day') return setDate(startOfMonth(ctx), step);
  if (res === 'month') return setMonth(startOfYear(ctx), step);
  const decadeStart = Math.floor(ctx.getFullYear() / 10) * 10;
  return setYear(ctx, decadeStart + step);
};

export const DateTimeSlider: React.FC = (props: DateTimeSliderProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const [timeline, setTimeline] = useState<TimelineState>(() => {
    const init = props.currentDateTime ? parseISO(props.currentDateTime) : new Date();
    const valid = isValid(init) ? init : new Date();
    return {
      resolution: 'month',
      currentContext: valid,
      currentStep: valid.getMonth()
    };
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isCompact, setIsCompact] = useState<boolean>(props.compact ?? false);
  
  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  const isNarrow = containerWidth > 0 ? containerWidth < 500 : isMobile;

  const advanceTimeline = (state: TimelineState, direction: 1 | -1): TimelineState => {
    const { resolution, currentContext, currentStep } = state;
    const { max, min } = getSliderBounds(resolution, currentContext);
    
    let nextStep = currentStep + direction;
    let nextContext = currentContext;

    // Handle Context Shifting (Paging) when reaching the ends
    if (nextStep > max) {
       nextContext = addUnits(resolution, currentContext, 1);
       nextStep = getSliderBounds(resolution, nextContext).min;
    } else if (nextStep < min) {
       nextContext = addUnits(resolution, currentContext, -1);
       nextStep = getSliderBounds(resolution, nextContext).max;
    }

    // Check Hard Bounds Constraint
    const exactDate = computeExactDate(resolution, nextContext, nextStep);
    if (props.endDateTime && direction === 1 && isAfter(exactDate, parseISO(props.endDateTime))) {
       return state; 
    }
    if (props.startDateTime && direction === -1 && isBefore(exactDate, parseISO(props.startDateTime))) {
       return state;
    }

    return { resolution, currentContext: nextContext, currentStep: nextStep };
  };

  // Engine for continuous playback
  useEffect(() => {
    // Pause the timer if not playing, or if we are currently loading data
    if (!isPlaying || props.isLoading) return;

    const timeout = setTimeout(() => {
      setTimeline(prev => {
         const nextState = advanceTimeline(prev, 1);
         // If it didn't advance, we've hit a hard bound; stop playing.
         if (nextState === prev) {
            setIsPlaying(false);
         }
         return nextState;
      });
    }, 1000 / playbackSpeed);

    return () => clearTimeout(timeout);
  }, [isPlaying, props.isLoading, playbackSpeed, timeline, props.startDateTime, props.endDateTime]);

  // Bubble state changes up to the parent map component with debouncing for manual scrubbing
  useEffect(() => {
    const exactDate = computeExactDate(timeline.resolution, timeline.currentContext, timeline.currentStep);
    if (isValid(exactDate) && props.setCurrentDateTime) {
      if (isPlaying) {
        // During playback, we want immediate updates to keep the frame rate tight
        props.setCurrentDateTime(exactDate.toISOString());
      } else {
        // Debounce manual scrubbing by 150ms to prevent "request storms" to the server/GPU
        const timeoutId = setTimeout(() => {
          props.setCurrentDateTime(exactDate.toISOString());
        }, 150);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [timeline.resolution, timeline.currentContext, timeline.currentStep, props.setCurrentDateTime, isPlaying]);

  const handleContextShift = (direction: 1 | -1) => {
     setTimeline(prev => {
        const nextContext = addUnits(prev.resolution, prev.currentContext, direction);
        return { ...prev, currentContext: nextContext, currentStep: getSliderBounds(prev.resolution, nextContext).min };
     });
  };

  const isAtEnd = advanceTimeline(timeline, 1) === timeline;

  const togglePlayOrReplay = () => {
    if (!isPlaying && isAtEnd) {
      // Snap back to the beginning of the valid dataset bounds
      if (props.startDateTime) {
        const d = parseISO(props.startDateTime);
        if (isValid(d)) {
          setTimeline(prev => ({
            ...prev,
            currentContext: d,
            currentStep: prev.resolution === 'day' ? d.getDate() : prev.resolution === 'month' ? d.getMonth() : d.getFullYear() % 10
          }));
          setIsPlaying(true);
          return;
        }
      }
    }
    setIsPlaying(!isPlaying);
  };

  const bounds = getSliderBounds(timeline.resolution, timeline.currentContext);

  const marks = useMemo(() => {
    if (timeline.resolution === 'day') {
       return [
          { value: 1, label: '1st' },
          { value: Math.floor(bounds.max / 2), label: '15th' },
          { value: bounds.max, label: `${bounds.max}th` }
       ];
    }
    if (timeline.resolution === 'month') {
       return [
         { value: 0, label: 'Jan' },
         { value: 3, label: 'Apr' },
         { value: 6, label: 'Jul' },
         { value: 9, label: 'Oct' },
         { value: 11, label: 'Dec' },
       ];
    }
    const decadeStart = Math.floor(timeline.currentContext.getFullYear() / 10) * 10;
    return [
       { value: 0, label: `${decadeStart}` },
       { value: 5, label: `'${String(decadeStart + 5).slice(-2)}` },
       { value: 9, label: `'${String(decadeStart + 9).slice(-2)}` }
    ];
  }, [timeline.resolution, timeline.currentContext, bounds.max]);

  const formatValueLabel = (val: number) => {
    if (timeline.resolution === 'day') return `${val}`;
    if (timeline.resolution === 'month') return format(setMonth(new Date(), val), 'MMM');
    const decadeStart = Math.floor(timeline.currentContext.getFullYear() / 10) * 10;
    return `${decadeStart + val}`;
  };
  
  const bufferPercentage = useMemo(() => {
    if (!props.bufferedDateTime) return 0;
    const bufferedDate = parseISO(props.bufferedDateTime);
    if (!isValid(bufferedDate)) return 0;
    
    const minDate = computeExactDate(timeline.resolution, timeline.currentContext, bounds.min);
    const maxDate = computeExactDate(timeline.resolution, timeline.currentContext, bounds.max);
    
    if (isBefore(bufferedDate, minDate)) return 0;
    if (isAfter(bufferedDate, maxDate)) return 100;
    
    const total = maxDate.getTime() - minDate.getTime();
    if (total <= 0) return 0;
    const current = bufferedDate.getTime() - minDate.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  }, [props.bufferedDateTime, timeline.resolution, timeline.currentContext, bounds]);

  return (
    <Paper 
        ref={rootRef}
        elevation={6} 
        sx={{
          flex: 1,
          padding: isCompact ? 1.5 : 2, 
          borderRadius: '20px', 
          background: 'rgba(10,15,20,0.75)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(126,239,168,0.18)',
          boxShadow: '0 0 40px rgba(126,239,168,0.15), inset 0 0 20px rgba(0,0,0,0.6)',
          color: 'white',
          minWidth: 'full',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Stack direction="column" spacing={1.5}>
          
          {/* 1. Header: Resolution Settings & Current Display Page Context */}
          {!isCompact && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
               <ToggleButtonGroup
                  size="small"
                  value={timeline.resolution}
                  exclusive
                  onChange={(_, val) => {
                     if (val) setTimeline(prev => ({ ...prev, resolution: val, currentStep: getSliderBounds(val as Resolution, prev.currentContext).min }));
                  }}
                  sx={{
                    height: 28,
                    '& .MuiToggleButton-root': {
                      color: 'rgba(255,255,255,0.5)',
                      borderColor: 'rgba(126,239,168,0.2)',
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      px: 1.5,
                      '&.Mui-selected': {
                        color: '#0a0f14',
                        backgroundColor: '#7EEFA8',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#5ad887' }
                      },
                      '&:hover': { backgroundColor: 'rgba(126,239,168,0.1)' }
                    }
                  }}
               >
                  <ToggleButton value="day">Day</ToggleButton>
                  <ToggleButton value="month">Month</ToggleButton>
                  <ToggleButton value="year">Year</ToggleButton>
               </ToggleButtonGroup>
  
               <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>
                  {timeline.resolution === 'day' && format(timeline.currentContext, 'MMMM yyyy')}
                  {timeline.resolution === 'month' && format(timeline.currentContext, 'yyyy')}
                  {timeline.resolution === 'year' && `${Math.floor(timeline.currentContext.getFullYear() / 10) * 10}s Decade`}
               </Typography>
            </Stack>
          )}

          {/* 2. Primary Tools: Playback, Slider, and Exact Focus Display */}
          <Stack direction={isNarrow ? 'column' : 'row'} spacing={isNarrow ? 1 : (isCompact ? 2 : 3)} alignItems={isNarrow ? 'stretch' : 'center'}>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center">
                {!isCompact && (
                  <IconButton size="small" onClick={() => handleContextShift(-1)} disabled={props.isLoading} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ffffff' } }}>
                    <SkipPrevious />
                  </IconButton>
                )}
                <IconButton 
                  onClick={togglePlayOrReplay}
                  sx={{ 
                    bgcolor: '#7EEFA8', 
                    color: '#0a0f14', 
                    mx: isCompact ? 0 : 1,
                    width: isCompact ? 32 : 40,
                    height: isCompact ? 32 : 40,
                    '&:hover': { bgcolor: '#5ad887' } 
                  }}
                >
                  {isPlaying && props.isLoading ? <CircularProgress size={isCompact ? 20 : 24} sx={{ color: '#0a0f14' }} /> : isAtEnd && !isPlaying ? <Replay fontSize={isCompact ? 'small' : 'medium'} /> : isPlaying ? <Pause size={isCompact ? 18 : 24} /> : <PlayArrow fontSize={isCompact ? 'small' : 'medium'} />}
                </IconButton>
                {!isCompact && (
                  <>
                    <IconButton size="small" onClick={() => handleContextShift(1)} disabled={props.isLoading} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ffffff' } }}>
                      <SkipNext />
                    </IconButton>
                    <Button 
                      onClick={() => setPlaybackSpeed(s => s === 1 ? 2 : s === 2 ? 5 : s === 5 ? 10 : 1)}
                      sx={{ minWidth: '40px', color: '#7EEFA8', fontSize: '0.75rem', ml: 1 }}
                    >
                      {playbackSpeed}x
                    </Button>
                  </>
                )}
              </Stack>
              
              {isNarrow && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" sx={{ lineHeight: 1, color: '#7EEFA8', fontWeight: 'bold', fontSize: isCompact ? '1rem' : '1.15rem' }}>
                    {(() => {
                      const exactDate = computeExactDate(timeline.resolution, timeline.currentContext, timeline.currentStep);
                      if (timeline.resolution === 'day') return format(exactDate, 'MMM do');
                      if (timeline.resolution === 'month') return format(exactDate, 'MMMM');
                      return format(exactDate, 'yyyy');
                    })()}
                  </Typography>
                  <IconButton size="small" onClick={() => setIsCompact(!isCompact)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ffffff' }, p: 0.5 }}>
                    {isCompact ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Stack>
              )}
            </Stack>

            <Box sx={{ flexGrow: 1, px: isNarrow ? 1 : 2, py: isNarrow ? 1 : 0 }}>
            <GISSplitSlider
              value={timeline.currentStep}
              min={bounds.min}
              max={bounds.max}
              step={1}
              marks={marks}
              valueLabelDisplay="auto"
              valueLabelFormat={formatValueLabel}
              onChange={(_, newValue) => setTimeline(prev => ({ ...prev, currentStep: newValue as number }))}
              sx={{
                '& .MuiSlider-rail': {
                  opacity: 1,
                  background: `linear-gradient(90deg, rgba(126,239,168,0.4) ${bufferPercentage}%, rgba(255,255,255,0.1) ${bufferPercentage}%)`,
                }
              }}
            />
          </Box>

            {!isNarrow && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: isCompact ? 100 : 130, justifyContent: 'flex-end' }}>
                <Typography variant="h6" sx={{ lineHeight: 1, color: '#7EEFA8', fontWeight: 'bold', fontSize: isCompact ? '1.1rem' : '1.25rem' }}>
                  {(() => {
                    const exactDate = computeExactDate(timeline.resolution, timeline.currentContext, timeline.currentStep);
                    if (timeline.resolution === 'day') return format(exactDate, 'MMM do');
                    if (timeline.resolution === 'month') return format(exactDate, 'MMMM');
                    return format(exactDate, 'yyyy');
                  })()}
                </Typography>
                <IconButton size="small" onClick={() => setIsCompact(!isCompact)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ffffff' }, p: 0.5 }}>
                  {isCompact ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Stack>
            )}

          </Stack>
        </Stack>
      </Paper>
  );
}


const GISSplitSlider = styled(Slider)(({ theme }) => ({
  color: '#7EEFA8',
  height: 6,
  '& .MuiSlider-track': { border: 'none' },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 0 10px rgba(126,239,168,0.5)',
    },
    '&:before': { display: 'none' },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 11,
    padding: '4px 8px',
    borderRadius: '8px',
    backgroundColor: '#7EEFA8',
    color: '#0a0f14',
    fontWeight: 800,
  },
  '& .MuiSlider-markLabel': {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.75rem',
    fontWeight: 500,
    '&.MuiSlider-markLabelActive': {
      color: 'white',
      fontWeight: 700
    }
  },
  '& .MuiSlider-mark': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    '&.MuiSlider-markActive': {
      backgroundColor: 'rgba(255,255,255,0.8)'
    }
  }
}));