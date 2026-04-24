import { Box } from '@mui/material';
import { useAppSelector } from '../../../state/hooks';
import { SpeciesOverlaysPanel } from './SpeciesOverlayModal';
import { IROverlaysPanel } from './irOverlayModal';

export const OverlayPanel: React.FC = () => {
  const isVectorPanelVisible = useAppSelector((s) => s.map.map_drawer.open);

  return (
    <Box
      sx={{
        position: 'relative',
        width: 0,
        overflow: 'visible',
        display: 'flex',
        backgroundColor: 'red',
      }}
    >
      <Box
        sx={{
          flex: 1,
          position: 'absolute',
          boxSizing: 'border-box',
          top: 0,
          left: 0,
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'auto',
          height: '100%',
          margin: isVectorPanelVisible ? '0 8px 8px 8px' : '0',
          width: isVectorPanelVisible ? 'calc(100% - 16px)' : '100%',
          minHeight: '100%',
          minWidth: 'fit-content',
        }}
      >
        <SpeciesOverlaysPanel />
        <IROverlaysPanel />
      </Box>
    </Box>
  );
};
