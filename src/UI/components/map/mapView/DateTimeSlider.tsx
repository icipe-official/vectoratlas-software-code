import {
  SkipPrevious,
  PlayArrow,
  SkipNext,
  Replay,
  ExpandLess,
  ExpandMore,
  ErrorOutline,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Paper,
  Slider,
  Stack,
  styled,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Button,
  useMediaQuery,
} from '@mui/material';
import { Pause } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  addMonths,
  addYears,
  getDaysInMonth,
  startOfMonth,
  startOfYear,
  format,
  setDate,
  setMonth,
  setYear,
  parseISO,
  isValid,
  isBefore,
  isAfter,
} from 'date-fns';
import theme from '../../../styles/theme';

// ---We can add A Wrapper DateTimeSlider component here that hooks into the reducer state and handles the time series synchronization ----
import { useAppSelector, useAppDispatch } from '../../../state/hooks';
import {
  setWMTSLayerVisibility,
  setCurrentTime,
  togglePreloadTimeSeries,
} from '../../../state/map/mapSlice';

export const TimeSeriesMapSlider: React.FC = () => {
  const dispatch = useAppDispatch();

  // State selectors
  const timeSeries = useAppSelector((state) => state.map.timeSeries);
  const wmtsLayers = useAppSelector((state) => state.map.wmtsLayers);

  const { currentTime, groups } = timeSeries;
  const dataState = useAppSelector((state) => state.map.timeSeries.dataState);
  const preloadTimeSeries = useAppSelector(
    (state) => state.map.preloadTimeSeries
  );

  // Filter for groups that are currently toggled for playback in the side panel
  const activeGroups = useMemo(() => {
    return Object.values(groups).filter((g) => g.isPlaybackActive);
  }, [groups]);

  // The bridge: Update WMTS layer visibility whenever currentTime changes
  useEffect(() => {
    if (currentTime === null) return;

    activeGroups.forEach((group) => {
      group.temporalLayers.forEach((tLayer) => {
        // Determine if this specific temporal layer falls into the current time bounds
        const isCurrent =
          currentTime >= tLayer.startTime && currentTime <= tLayer.endTime;

        // Find the matching OpenLayers WMTS state object
        const wmtsLayer = wmtsLayers.find((l) => l.name === tLayer.layerName);

        if (wmtsLayer) {
          // If it matches the current time but is NOT visible, toggle it ON
          if (isCurrent && !wmtsLayer.isVisible) {
            dispatch(
              setWMTSLayerVisibility({ name: wmtsLayer.name, isVisible: true })
            );
          }
          // If it does NOT match the current time but IS visible, toggle it OFF
          else if (!isCurrent && wmtsLayer.isVisible) {
            dispatch(
              setWMTSLayerVisibility({ name: wmtsLayer.name, isVisible: false })
            );
          }
        }
      });
    });
  }, [currentTime, activeGroups, wmtsLayers, dispatch]);

  // If no time-series are activated from the modals, we shouldn't render the slider
  if (activeGroups.length === 0) {
    return null;
  }

  // Derive aggregate time bounds across all active time-series groups
  const startDateTime = new Date(
    Math.min(...activeGroups.map((g) => g.startTime))
  ).toISOString();
  const endDateTime = new Date(
    Math.max(...activeGroups.map((g) => g.endTime))
  ).toISOString();
  const currentDateTime =
    currentTime !== null ? new Date(currentTime).toISOString() : undefined;

  const derivedResolution = activeGroups[0]?.defaultResolution ?? 'year';

  // Create a handler that satisfies React.Dispatch<React.SetStateAction<string>>
  // This allows the generic DateTimeSlider to update Redux naturally
  const handleSliderChange: React.Dispatch<React.SetStateAction<string>> = (
    value
  ) => {
    let newTimeStr: string;
    if (typeof value === 'function') {
      const currentIso =
        currentTime !== null
          ? new Date(currentTime).toISOString()
          : new Date().toISOString();
      newTimeStr = value(currentIso);
    } else {
      newTimeStr = value;
    }
    dispatch(setCurrentTime(new Date(newTimeStr).getTime()));
  };

  return (
    <DateTimeSlider
      startDateTime={startDateTime}
      endDateTime={endDateTime}
      minDateTime={startDateTime}
      maxDateTime={endDateTime}
      currentDateTime={currentDateTime}
      setCurrentDateTime={handleSliderChange}
      defaultResolution={derivedResolution}
      compact={true}
      dataState={dataState}
      preloadEnabled={preloadTimeSeries}
      onTogglePreload={() => dispatch(togglePreloadTimeSeries())}
    />
  );
};
// ------------------------------

export type DataState = 'ready' | 'loading' | 'error';

export interface DateTimeSliderProps {
  startDateTime?: string;
  endDateTime?: string;
  minDateTime?: string;
  maxDateTime?: string;
  currentDateTime?: string;
  setCurrentDateTime?: React.Dispatch<React.SetStateAction<string>>;
  dataState?: DataState; // State enum to sync slider with data fetch status
  compact?: boolean; // Initial state of whether the slider is in compact mode
  defaultResolution?: Resolution; // Initial resolution scale for the slider
  preloadEnabled?: boolean;
  onTogglePreload?: () => void;
}

type Resolution = 'day' | 'month' | 'year';

interface TimelineState {
  resolution: Resolution;
  currentContext: Date; // e.g., Oct 1, 2026
  currentStep: number; // The actual slider value
}

const getLocalFromUTC = (dateStr?: string): Date | undefined => {
  if (!dateStr) return undefined;
  const d = parseISO(dateStr);
  if (!isValid(d)) return undefined;
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    12,
    0,
    0
  ); // Noon enforces a perfect mid-day local padding
};

const getUTCFromLocal = (d: Date): Date => {
  return new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0)
  );
};

const getSliderBounds = (
  res: Resolution,
  ctx: Date,
  minDateStr?: string,
  maxDateStr?: string
) => {
  let min = 0;
  let max = 0;
  const minDate = getLocalFromUTC(minDateStr);
  const maxDate = getLocalFromUTC(maxDateStr);
  const isMinValid = minDate && isValid(minDate);
  const isMaxValid = maxDate && isValid(maxDate);

  if (res === 'day') {
    min = 1;
    max = getDaysInMonth(ctx);
    if (isMinValid) {
      if (startOfMonth(ctx) < startOfMonth(minDate)) {
        min = 32;
        max = 0;
      } else if (
        startOfMonth(ctx).getTime() === startOfMonth(minDate).getTime()
      )
        min = Math.max(min, minDate.getDate());
    }
    if (isMaxValid) {
      if (startOfMonth(ctx) > startOfMonth(maxDate)) {
        min = 32;
        max = 0;
      } else if (
        startOfMonth(ctx).getTime() === startOfMonth(maxDate).getTime()
      )
        max = Math.min(max, maxDate.getDate());
    }
  } else if (res === 'month') {
    min = 0;
    max = 11;
    if (isMinValid) {
      if (startOfYear(ctx) < startOfYear(minDate)) {
        min = 12;
        max = -1;
      } else if (startOfYear(ctx).getTime() === startOfYear(minDate).getTime())
        min = Math.max(min, minDate.getMonth());
    }
    if (isMaxValid) {
      if (startOfYear(ctx) > startOfYear(maxDate)) {
        min = 12;
        max = -1;
      } else if (startOfYear(ctx).getTime() === startOfYear(maxDate).getTime())
        max = Math.min(max, maxDate.getMonth());
    }
  } else if (res === 'year') {
    if (isMinValid && isMaxValid) {
      min = minDate.getFullYear();
      max = maxDate.getFullYear();
    } else {
      min = 0;
      max = 9;
      const decadeStart = Math.floor(ctx.getFullYear() / 10) * 10;
      if (isMinValid) {
        const minYear = minDate.getFullYear();
        if (decadeStart + 9 < minYear) {
          min = 10;
          max = -1;
        } else if (minYear >= decadeStart && minYear <= decadeStart + 9)
          min = Math.max(min, minYear - decadeStart);
      }
      if (isMaxValid) {
        const maxYear = maxDate.getFullYear();
        if (decadeStart > maxYear) {
          min = 10;
          max = -1;
        } else if (maxYear >= decadeStart && maxYear <= decadeStart + 9)
          max = Math.min(max, maxYear - decadeStart);
      }
    }
  }
  return { min, max };
};

const addUnits = (res: Resolution, date: Date, amount: number) => {
  if (res === 'day') return addMonths(date, amount);
  if (res === 'month') return addYears(date, amount);
  return addYears(date, amount * 10);
};

const computeExactDate = (
  res: Resolution,
  ctx: Date,
  step: number,
  minDateStr?: string,
  maxDateStr?: string
) => {
  let d: Date;
  if (res === 'day') d = setDate(startOfMonth(ctx), step);
  else if (res === 'month') d = setMonth(startOfYear(ctx), step);
  else {
    const minDate = getLocalFromUTC(minDateStr);
    const maxDate = getLocalFromUTC(maxDateStr);
    if (minDate && maxDate && isValid(minDate) && isValid(maxDate)) {
      d = setYear(ctx, step);
    } else {
      const decadeStart = Math.floor(ctx.getFullYear() / 10) * 10;
      d = setYear(ctx, decadeStart + step);
    }
  }
  d.setHours(12, 0, 0, 0);
  return d;
};

export const DateTimeSlider: React.FC = (props: DateTimeSliderProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const [timeline, setTimeline] = useState<TimelineState>(() => {
    const init = getLocalFromUTC(props.currentDateTime);
    let valid = init && isValid(init) ? init : new Date();
    valid.setHours(12, 0, 0, 0);

    const minD = getLocalFromUTC(props.minDateTime);
    const maxD = getLocalFromUTC(props.maxDateTime);

    if (minD && isValid(minD) && isBefore(valid, minD)) {
      valid = minD;
    }
    if (maxD && isValid(maxD) && isAfter(valid, maxD)) {
      valid = maxD;
    }

    const res = props.defaultResolution ?? 'month';

    let step = 0;
    if (res === 'day') step = valid.getDate();
    else if (res === 'month') step = valid.getMonth();
    else if (res === 'year') {
      if (props.minDateTime && props.maxDateTime) {
        step = valid.getFullYear();
      } else {
        step = valid.getFullYear() % 10;
      }
    }

    return {
      resolution: res,
      currentContext: valid,
      currentStep: step,
    };
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isCompact, setIsCompact] = useState<boolean>(props.compact ?? false);

  const [lastLoadDuration, setLastLoadDuration] = useState<number>(0);
  const loadingStartTime = useRef<number | null>(null);

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

  const isReady = props.dataState === undefined || props.dataState === 'ready';
  const isLoading = props.dataState === 'loading';
  const isError = props.dataState === 'error';

  useEffect(() => {
    if (props.dataState === 'loading') {
      if (loadingStartTime.current === null) {
        loadingStartTime.current = performance.now();
      }
    } else if (props.dataState === 'ready') {
      if (loadingStartTime.current !== null) {
        setLastLoadDuration(performance.now() - loadingStartTime.current);
        loadingStartTime.current = null;
      }
    } else {
      loadingStartTime.current = null;
    }
  }, [props.dataState]);

  const advanceTimeline = (
    state: TimelineState,
    direction: 1 | -1
  ): TimelineState => {
    const { resolution, currentContext, currentStep } = state;
    const { max, min } = getSliderBounds(
      resolution,
      currentContext,
      props.minDateTime,
      props.maxDateTime
    );

    let nextStep = currentStep + direction;
    let nextContext = currentContext;

    // Handle Context Shifting (Paging) when reaching the ends, but not for full-range year slider
    if (!(resolution === 'year' && props.minDateTime && props.maxDateTime)) {
      if (nextStep > max) {
        nextContext = addUnits(resolution, currentContext, 1);
        const nextBounds = getSliderBounds(
          resolution,
          nextContext,
          props.minDateTime,
          props.maxDateTime
        );
        if (nextBounds.min > nextBounds.max) return state; // Hard stop
        nextStep = nextBounds.min;
      } else if (nextStep < min) {
        nextContext = addUnits(resolution, currentContext, -1);
        const nextBounds = getSliderBounds(
          resolution,
          nextContext,
          props.minDateTime,
          props.maxDateTime
        );
        if (nextBounds.min > nextBounds.max) return state; // Hard stop
        nextStep = nextBounds.max;
      }
    }

    // Check Hard Bounds Constraint
    const exactDate = computeExactDate(
      resolution,
      nextContext,
      nextStep,
      props.minDateTime,
      props.maxDateTime
    );
    const upperBound = getLocalFromUTC(props.maxDateTime || props.endDateTime);
    const lowerBound = getLocalFromUTC(
      props.minDateTime || props.startDateTime
    );

    if (upperBound && direction === 1 && isAfter(exactDate, upperBound)) {
      return state;
    }
    if (lowerBound && direction === -1 && isBefore(exactDate, lowerBound)) {
      return state;
    }

    return { resolution, currentContext: nextContext, currentStep: nextStep };
  };

  // Engine for continuous playback
  useEffect(() => {
    // Pause the timer if not playing, or if we are currently loading data
    if (!isPlaying || !isReady) return;

    const baseDelay = 1000 / playbackSpeed;
    // Increase the time taken to transition to the next by how long it took to load previously
    const currentDelay = props.preloadEnabled
      ? baseDelay
      : baseDelay + lastLoadDuration;

    const timeout = setTimeout(() => {
      setTimeline((prev) => {
        const nextState = advanceTimeline(prev, 1);
        // If it didn't advance, we've hit a hard bound; stop playing.
        if (nextState === prev) {
          setIsPlaying(false);
        }
        return nextState;
      });
      setLastLoadDuration(0); // Reset for the next transition
    }, currentDelay);

    return () => clearTimeout(timeout);
  }, [
    isPlaying,
    isReady,
    playbackSpeed,
    timeline,
    props.startDateTime,
    props.endDateTime,
    lastLoadDuration,
  ]);

  // Bubble state changes up to the parent map component with debouncing for manual scrubbing
  useEffect(() => {
    const exactDate = computeExactDate(
      timeline.resolution,
      timeline.currentContext,
      timeline.currentStep,
      props.minDateTime,
      props.maxDateTime
    );
    if (isValid(exactDate) && props.setCurrentDateTime) {
      const utcDateStr = getUTCFromLocal(exactDate).toISOString();
      if (isPlaying) {
        // During playback, we want immediate updates to keep the frame rate tight
        props.setCurrentDateTime(utcDateStr);
      } else {
        // Debounce manual scrubbing by 150ms to prevent "request storms" to the server/GPU
        const timeoutId = setTimeout(() => {
          props.setCurrentDateTime(utcDateStr);
        }, 150);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [
    timeline.resolution,
    timeline.currentContext,
    timeline.currentStep,
    props.setCurrentDateTime,
    isPlaying,
    props.minDateTime,
    props.maxDateTime,
  ]);

  const handleContextShift = (direction: 1 | -1) => {
    setTimeline((prev) => {
      const nextContext = addUnits(
        prev.resolution,
        prev.currentContext,
        direction
      );
      const newBounds = getSliderBounds(
        prev.resolution,
        nextContext,
        props.minDateTime,
        props.maxDateTime
      );
      if (newBounds.min <= newBounds.max) {
        return {
          ...prev,
          currentContext: nextContext,
          currentStep: direction === 1 ? newBounds.min : newBounds.max,
        };
      }
      return prev;
    });
  };

  const canShiftPrev = useMemo(() => {
    if (
      timeline.resolution === 'year' &&
      props.minDateTime &&
      props.maxDateTime
    ) {
      return false;
    }
    const nextContext = addUnits(
      timeline.resolution,
      timeline.currentContext,
      -1
    );
    const newBounds = getSliderBounds(
      timeline.resolution,
      nextContext,
      props.minDateTime,
      props.maxDateTime
    );
    return newBounds.min <= newBounds.max;
  }, [
    timeline.resolution,
    timeline.currentContext,
    props.minDateTime,
    props.maxDateTime,
  ]);

  const canShiftNext = useMemo(() => {
    if (
      timeline.resolution === 'year' &&
      props.minDateTime &&
      props.maxDateTime
    ) {
      return false;
    }
    const nextContext = addUnits(
      timeline.resolution,
      timeline.currentContext,
      1
    );
    const newBounds = getSliderBounds(
      timeline.resolution,
      nextContext,
      props.minDateTime,
      props.maxDateTime
    );
    return newBounds.min <= newBounds.max;
  }, [
    timeline.resolution,
    timeline.currentContext,
    props.minDateTime,
    props.maxDateTime,
  ]);

  const isAtEnd = advanceTimeline(timeline, 1) === timeline;

  const togglePlayOrReplay = () => {
    if (!isPlaying && isAtEnd) {
      // Snap back to the beginning of the valid dataset bounds
      const lowerBound = props.minDateTime || props.startDateTime;
      if (lowerBound) {
        const d = getLocalFromUTC(lowerBound);
        if (isValid(d)) {
          setTimeline((prev) => {
            let newStep;
            if (prev.resolution === 'day') {
              newStep = d.getDate();
            } else if (prev.resolution === 'month') {
              newStep = d.getMonth();
            } else {
              // year
              if (props.minDateTime && props.maxDateTime) {
                newStep = d.getFullYear();
              } else {
                newStep = d.getFullYear() % 10;
              }
            }
            return { ...prev, currentContext: d, currentStep: newStep };
          });
          setIsPlaying(true);
          return;
        }
      }
    }
    setIsPlaying(!isPlaying);
  };

  const bounds = getSliderBounds(
    timeline.resolution,
    timeline.currentContext,
    props.minDateTime,
    props.maxDateTime
  );
  const sliderMin = bounds.min <= bounds.max ? bounds.min : 0;
  const sliderMax = bounds.min <= bounds.max ? bounds.max : 0;
  const sliderValue = Math.min(
    Math.max(timeline.currentStep, sliderMin),
    sliderMax
  );

  const marks = useMemo(() => {
    let allMarks: { value: number; label: string }[] = [];
    if (timeline.resolution === 'day') {
      const maxDays = getDaysInMonth(timeline.currentContext);
      allMarks = [
        { value: 1, label: '1st' },
        { value: Math.floor(maxDays / 2), label: '15th' },
        { value: maxDays, label: `${maxDays}th` },
      ];
    } else if (timeline.resolution === 'month') {
      allMarks = [
        { value: 0, label: 'Jan' },
        { value: 3, label: 'Apr' },
        { value: 6, label: 'Jul' },
        { value: 9, label: 'Oct' },
        { value: 11, label: 'Dec' },
      ];
    } else {
      if (props.minDateTime && props.maxDateTime) {
        const minDate = getLocalFromUTC(props.minDateTime);
        const maxDate = getLocalFromUTC(props.maxDateTime);
        if (minDate && maxDate) {
          const minYear = minDate.getFullYear();
          const maxYear = maxDate.getFullYear();
          const range = maxYear - minYear;

          allMarks.push({ value: minYear, label: `${minYear}` });

          if (range > 20) {
            for (let y = Math.ceil(minYear / 10) * 10; y <= maxYear; y += 10) {
              if (y > minYear && y < maxYear)
                allMarks.push({ value: y, label: `${y}` });
            }
          } else if (range > 5) {
            for (let y = minYear + (5 - (minYear % 5)); y < maxYear; y += 5) {
              if (y > minYear) allMarks.push({ value: y, label: `${y}` });
            }
          }

          if (minYear !== maxYear)
            allMarks.push({ value: maxYear, label: `${maxYear}` });
          allMarks = allMarks.filter(
            (mark, index, self) =>
              index === self.findIndex((t) => t.value === mark.value)
          );
        }
      } else {
        const decadeStart =
          Math.floor(timeline.currentContext.getFullYear() / 10) * 10;
        allMarks = [
          { value: 0, label: `${decadeStart}` },
          { value: 5, label: `'${String(decadeStart + 5).slice(-2)}` },
          { value: 9, label: `'${String(decadeStart + 9).slice(-2)}` },
        ];
      }
    }
    return allMarks.filter((m) => m.value >= sliderMin && m.value <= sliderMax);
  }, [
    timeline.resolution,
    timeline.currentContext,
    sliderMin,
    sliderMax,
    props.minDateTime,
    props.maxDateTime,
  ]);

  const formatValueLabel = (val: number) => {
    if (timeline.resolution === 'day') return `${val}`;
    if (timeline.resolution === 'month')
      return format(setMonth(new Date(), val), 'MMM');
    if (props.minDateTime && props.maxDateTime) {
      return `${val}`;
    } else {
      const decadeStart =
        Math.floor(timeline.currentContext.getFullYear() / 10) * 10;
      return `${decadeStart + val}`;
    }
  };

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
        boxShadow:
          '0 0 40px rgba(126,239,168,0.15), inset 0 0 20px rgba(0,0,0,0.6)',
        color: 'white',
        minWidth: 'full',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Stack direction="column" spacing={1.5}>
        {/* 1. Header: Resolution Settings & Current Display Page Context */}
        {!isCompact && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            <ToggleButtonGroup
              disabled={isLoading}
              size="small"
              value={timeline.resolution}
              exclusive
              onChange={(_, val) => {
                if (val) {
                  setTimeline((prev) => {
                    const newRes = val as Resolution;
                    const currentExact = computeExactDate(
                      prev.resolution,
                      prev.currentContext,
                      prev.currentStep,
                      props.minDateTime,
                      props.maxDateTime
                    );
                    const newBounds = getSliderBounds(
                      newRes,
                      currentExact,
                      props.minDateTime,
                      props.maxDateTime
                    );
                    let newStep = prev.currentStep;
                    if (newRes === 'day') newStep = currentExact.getDate();
                    else if (newRes === 'month')
                      newStep = currentExact.getMonth();
                    else if (newRes === 'year') {
                      if (props.minDateTime && props.maxDateTime) {
                        newStep = currentExact.getFullYear();
                      } else {
                        newStep = currentExact.getFullYear() % 10;
                      }
                    }
                    if (newBounds.min <= newBounds.max) {
                      if (newStep < newBounds.min) newStep = newBounds.min;
                      if (newStep > newBounds.max) newStep = newBounds.max;
                    }
                    return {
                      ...prev,
                      resolution: newRes,
                      currentContext: currentExact,
                      currentStep: newStep,
                    };
                  });
                }
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
                    '&:hover': { backgroundColor: '#5ad887' },
                  },
                  '&:hover': { backgroundColor: 'rgba(126,239,168,0.1)' },
                },
              }}
            >
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="year">Year</ToggleButton>
            </ToggleButtonGroup>

            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {timeline.resolution === 'day' &&
                format(timeline.currentContext, 'MMMM yyyy')}
              {timeline.resolution === 'month' &&
                format(timeline.currentContext, 'yyyy')}
              {timeline.resolution === 'year' &&
                `${
                  Math.floor(timeline.currentContext.getFullYear() / 10) * 10
                }s Decade`}
            </Typography>
          </Stack>
        )}

        {/* 2. Primary Tools: Playback, Slider, and Exact Focus Display */}
        <Stack
          direction={isNarrow ? 'column' : 'row'}
          spacing={isNarrow ? 1 : isCompact ? 2 : 3}
          alignItems={isNarrow ? 'stretch' : 'center'}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center">
              {!isCompact && (
                <IconButton
                  size="small"
                  onClick={() => handleContextShift(-1)}
                  disabled={isLoading || !canShiftPrev}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { color: '#ffffff' },
                    '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
                  }}
                >
                  <SkipPrevious />
                </IconButton>
              )}
              <IconButton
                onClick={togglePlayOrReplay}
                sx={{
                  bgcolor: isError ? '#ff4d4d' : '#7EEFA8',
                  color: '#0a0f14',
                  mx: isCompact ? 0 : 1,
                  width: isCompact ? 32 : 40,
                  height: isCompact ? 32 : 40,
                  '&:hover': { bgcolor: isError ? '#ff3333' : '#5ad887' },
                }}
              >
                {isLoading ? (
                  <CircularProgress
                    size={isCompact ? 20 : 24}
                    sx={{ color: '#0a0f14' }}
                  />
                ) : isError ? (
                  <ErrorOutline fontSize={isCompact ? 'small' : 'medium'} />
                ) : isAtEnd && !isPlaying ? (
                  <Replay fontSize={isCompact ? 'small' : 'medium'} />
                ) : isPlaying ? (
                  <Pause size={isCompact ? 18 : 24} />
                ) : (
                  <PlayArrow fontSize={isCompact ? 'small' : 'medium'} />
                )}
              </IconButton>
              {!isCompact && (
                <>
                  <IconButton
                    size="small"
                    onClick={() => handleContextShift(1)}
                    disabled={isLoading || !canShiftNext}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': { color: '#ffffff' },
                      '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    <SkipNext />
                  </IconButton>
                  <Button
                    onClick={() =>
                      setPlaybackSpeed((s) =>
                        s === 1 ? 2 : s === 2 ? 5 : s === 5 ? 10 : 1
                      )
                    }
                    sx={{
                      minWidth: '40px',
                      color: '#7EEFA8',
                      fontSize: '0.75rem',
                      ml: 1,
                    }}
                  >
                    {playbackSpeed}x
                  </Button>
                  {props.onTogglePreload && (
                    <Button
                      onClick={props.onTogglePreload}
                      sx={{
                        minWidth: 'auto',
                        color: props.preloadEnabled
                          ? '#7EEFA8'
                          : 'rgba(255,255,255,0.5)',
                        fontSize: '0.65rem',
                        ml: 1,
                        textTransform: 'none',
                        border: `1px solid ${
                          props.preloadEnabled
                            ? 'rgba(126,239,168,0.5)'
                            : 'transparent'
                        }`,
                        borderRadius: '6px',
                        px: 1,
                      }}
                      title="Preload all time-series tiles for smooth playback"
                    >
                      Preload {props.preloadEnabled ? 'ON' : 'OFF'}
                    </Button>
                  )}
                </>
              )}
            </Stack>

            {isNarrow && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="h6"
                  sx={{
                    lineHeight: 1,
                    color: '#7EEFA8',
                    fontWeight: 'bold',
                    fontSize: isCompact ? '1rem' : '1.15rem',
                  }}
                >
                  {(() => {
                    const exactDate = computeExactDate(
                      timeline.resolution,
                      timeline.currentContext,
                      timeline.currentStep,
                      props.minDateTime,
                      props.maxDateTime
                    );
                    if (timeline.resolution === 'day')
                      return format(exactDate, 'MMM do');
                    if (timeline.resolution === 'month')
                      return format(exactDate, 'MMMM');
                    return format(exactDate, 'yyyy');
                  })()}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setIsCompact(!isCompact)}
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    '&:hover': { color: '#ffffff' },
                    p: 0.5,
                  }}
                >
                  {isCompact ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Stack>
            )}
          </Stack>

          <Box sx={{ flexGrow: 1, px: isNarrow ? 1 : 2, py: isNarrow ? 1 : 0 }}>
            <GISSplitSlider
              value={sliderValue}
              min={sliderMin}
              max={sliderMax}
              step={1}
              marks={marks}
              disabled={isLoading}
              valueLabelDisplay="auto"
              valueLabelFormat={formatValueLabel}
              onChange={(_, newValue) =>
                setTimeline((prev) => ({
                  ...prev,
                  currentStep: newValue as number,
                }))
              }
            />
          </Box>

          {!isNarrow && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                minWidth: isCompact ? 100 : 130,
                justifyContent: 'flex-end',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  lineHeight: 1,
                  color: '#7EEFA8',
                  fontWeight: 'bold',
                  fontSize: isCompact ? '1.1rem' : '1.25rem',
                }}
              >
                {(() => {
                  const exactDate = computeExactDate(
                    timeline.resolution,
                    timeline.currentContext,
                    timeline.currentStep,
                    props.minDateTime,
                    props.maxDateTime
                  );
                  if (timeline.resolution === 'day')
                    return format(exactDate, 'MMM do');
                  if (timeline.resolution === 'month')
                    return format(exactDate, 'MMMM');
                  return format(exactDate, 'yyyy');
                })()}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setIsCompact(!isCompact)}
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  '&:hover': { color: '#ffffff' },
                  p: 0.5,
                }}
              >
                {isCompact ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

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
      fontWeight: 700,
    },
  },
  '& .MuiSlider-mark': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    '&.MuiSlider-markActive': {
      backgroundColor: 'rgba(255,255,255,0.8)',
    },
  },
}));
