'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { useMobileDock } from './MobileDockContext';

// Popup palette, matching the overlay cards on desktop
const DARK_BG = 'rgba(18, 24, 20, 0.95)';
const DARK_TEXT = '#e8ede9';
const DARK_ACCENT = '#6baa75';
const DARK_BORDER = 'rgba(255,255,255,0.08)';
const DARK_HEADER_BG =
  'linear-gradient(105deg, rgba(107,170,117,0.15) 0%, rgba(255,255,255,0.025) 55%)';

interface DockPanelProps {
  id: string;
  title: string;
  icon: ElementType;
  open: boolean;
  onClose?: () => void; // omit for panels that should never be removed
  showTitle?: boolean; // false hides the title text; the buttons stay
  dark?: boolean; // use the dark overlay palette instead of the app theme
  card?: boolean; // floating card, centred and sized to its content
  transparent?: boolean;
  // Sheet only: how tall the sheet can grow, as a CSS value.
  // Default '100%' = the full map area.
  maxHeight?: string;
  // Sheet only: how wide the sheet is, as a CSS value.
  // Default '100%' = full width, pinned to both edges.
  // Any other value centres the sheet, e.g. 'min(88vw, 340px)'.
  width?: string;
  children: ReactNode;
}

export default function DockPanel({
  id,
  title,
  icon: Icon,
  open,
  onClose,
  showTitle = true,
  dark = false,
  card = false,
  maxHeight = '100%',
  width = '100%',
  children,
}: DockPanelProps) {
  const { register, unregister, show, activeId, minimize } = useMobileDock();

  // Remembers whether the panel was open on the previous render, so we can
  // tell "just opened" apart from "open since startup"
  const wasOpen = useRef(open);

  useEffect(() => {
    if (!open) {
      wasOpen.current = false;
      return;
    }

    register({ id, title, icon: Icon });

    // Only a panel that was just opened comes to the front.
    // Panels that were open at startup stay minimized in the dock.
    if (!wasOpen.current) show(id);
    wasOpen.current = true;

    return () => unregister(id);
  }, [open, id, title, Icon, register, unregister, show]);

  if (!open) return null;

  const isActive = activeId === id;
  const iconColor = dark ? DARK_ACCENT : 'primary.main';
  const buttonColor = dark ? DARK_ACCENT : 'inherit';

  // Full-width sheets pin to both edges. Narrower sheets are centred.
  const isFullWidth = width === '100%';

  // Card: floating, centred, sized to its content (max = map height).
  // Sheet (default): sits on top of the dock bar and is only as tall as its
  // content, capped at maxHeight. Narrower sheets are centred horizontally.
  const shape = card
    ? {
        top: 12,
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translateX(-50%)',
        width: 'min(280px, calc(100% - 32px))',
        maxHeight: 'calc(100% - 24px)',
        borderRadius: '12px',
        border: `1px solid ${dark ? DARK_BORDER : 'divider'}`,
        boxShadow: '0 20px 40px -8px rgba(0,0,0,0.5)',
      }
    : isFullWidth
    ? {
        top: 'auto',
        left: 0,
        right: 0,
        bottom: 0,
        maxHeight,
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        boxShadow: '0 -6px 24px rgba(0,0,0,0.28)',
      }
    : {
        top: 'auto',
        left: '50%',
        right: 'auto',
        bottom: 0,
        transform: 'translateX(-50%)',
        width,
        maxWidth: '100%',
        maxHeight,
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        boxShadow: '0 -6px 24px rgba(0,0,0,0.28)',
      };

  return (
    <Box
      sx={{
        display: isActive ? 'flex' : 'none', // hidden, not unmounted
        flexDirection: 'column',
        position: 'absolute',
        ...shape,
        minHeight: 0,
        zIndex: 1200,
        overflow: 'hidden',
        bgcolor: dark ? DARK_BG : 'background.paper',
        color: dark ? DARK_TEXT : 'text.primary',
        backdropFilter: dark ? 'blur(16px) saturate(140%)' : undefined,
      }}
    >
      {/* Title bar: stays fixed at the top of the panel */}
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: showTitle ? 'space-between' : 'flex-end',
          px: 2,
          py: 0.5,
          borderBottom: 1,
          borderColor: dark ? DARK_BORDER : 'divider',
          background: dark ? DARK_HEADER_BG : undefined,
          bgcolor: dark ? undefined : 'background.paper',
        }}
      >
        {showTitle && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Icon sx={{ color: iconColor, fontSize: 18 }} />
            <Typography fontWeight={700} fontSize="0.8rem">
              {title}
            </Typography>
          </Box>
        )}
        <Box>
          <IconButton
            aria-label="Minimize"
            onClick={minimize}
            sx={{ color: buttonColor }}
          >
            <RemoveIcon />
          </IconButton>
          {onClose && (
            <IconButton
              aria-label="Close"
              onClick={onClose}
              sx={{ color: buttonColor }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Content: scrolls when it's taller than the panel allows.
          The bottom padding and trailing margins are removed so the last
          control sits flush against the bottom of the sheet. */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          pb: 0,
          '& > *:last-child': { mb: 0, pb: 0 },
          '& .MuiList-root': { pb: 0 },
          '& .MuiDivider-root:last-child': { display: 'none' },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
