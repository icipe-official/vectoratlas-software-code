import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade } from '@mui/material';

interface MapLoaderProps {
  isLoading: boolean;
}

const MapLoader: React.FC<MapLoaderProps> = ({ isLoading }) => {
  // Optional: Add a slight delay before showing the loader to prevent
  // flashing on very fast network responses.
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setShow(true), 150); // 150ms debounce
    } else {
      setShow(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <Fade in={show} timeout={300}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10, 15, 20, 0.4)', // Matches your dark theme
          backdropFilter: 'blur(3px)', // Glassmorphism effect over the map
          zIndex: 15, // Keep it below the HUD (zIndex 20) but above the map
          pointerEvents: 'none', // Allow clicks to pass through if needed, or remove to block interaction
        }}
      >
        <Box sx={{ position: 'relative', width: 80, height: 80, mb: 2 }}>
          {/* Outer rotating ring */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: '#7EEFA8',
              borderRightColor: '#7EEFA8',
              animation: 'spin 1s linear infinite',
              opacity: 0.8,
            }}
          />
          {/* Inner pulsing core */}
          <Box
            sx={{
              position: 'absolute',
              inset: '25%',
              borderRadius: '50%',
              background: '#7EEFA8',
              animation: 'pulseCore 1.5s ease-in-out infinite',
              boxShadow: '0 0 20px rgba(126,239,168,0.6)',
            }}
          />
        </Box>

        <Typography
          sx={{
            color: '#7EEFA8',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(126,239,168,0.4)',
            animation: 'pulseText 1.5s ease-in-out infinite',
          }}
        >
          Gathering data for your view...
        </Typography>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulseCore {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.5; }
          }
          @keyframes pulseText {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default MapLoader;
