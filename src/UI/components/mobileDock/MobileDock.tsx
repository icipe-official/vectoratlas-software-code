'use client';

import { ButtonBase, Paper, Typography } from '@mui/material';
import { DOCK_HEIGHT, useMobileDock } from './MobileDockContext';

export default function MobileDock() {
  const { panels, activeId, show, minimize } = useMobileDock();

  if (panels.length === 0) return null;

  return (
    <Paper
      component="nav"
      data-testid="mobile-dock"
      elevation={8}
      square
      sx={{
        position: 'fixed',
        // Overrides any global margin on <nav>, so the bar sits flush
        m: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: DOCK_HEIGHT,
        zIndex: 1300,
        display: 'flex',
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {panels.map(({ id, title, icon: Icon }) => {
        const selected = activeId === id;
        return (
          <ButtonBase
            key={id}
            aria-label={title}
            aria-pressed={selected}
            // Tapping the active icon minimizes it; tapping another shows it
            onClick={() => (selected ? minimize() : show(id))}
            sx={{
              flex: 1,
              height: '100%',
              flexDirection: 'column',
              gap: 0.25,
              color: selected ? 'primary.main' : 'text.secondary',
              borderTop: 2,
              borderColor: selected ? 'primary.main' : 'transparent',
            }}
          >
            <Icon />
            <Typography variant="caption" noWrap maxWidth="100%">
              {title}
            </Typography>
          </ButtonBase>
        );
      })}
    </Paper>
  );
}
