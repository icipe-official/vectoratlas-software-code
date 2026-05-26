import { Stack } from '@mui/material';
import { SpeciesOverlaysPanel } from './SpeciesOverlayModal';
import { IROverlaysPanel } from './irOverlayModal';

export const OverlayPanel: React.FC = () => {
  return (
    <Stack direction="column">
      <SpeciesOverlaysPanel />
      <IROverlaysPanel />
    </Stack>
  );
};
