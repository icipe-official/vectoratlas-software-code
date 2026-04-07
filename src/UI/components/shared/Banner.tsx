import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';
// 1. ADD THESE IMPORTS
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const DISMISS_KEY = 'wip_banner_dismissed_v2';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export default function Banner() {
  const [visible, setVisible] = React.useState(false);

  // 2. DEFINE THE VARIABLE HERE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
  };

  return (
    <Snackbar
      open={visible}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
      sx={{
        top: { xs: '100px', sm: '100px' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#038543',
          color: '#ffffff',
          px: 2,
          py: 1,
          // Now isMobile will work correctly
          borderRadius: isMobile ? '0px' : '70px',
          width: '100%',
          maxWidth: isMobile ? '100%' : '800px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          boxSizing: 'border-box',
        }}
      >
        {/* ... rest of your code ... */}
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: '#ebbd40',
            mr: 2,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(235, 189, 64, 0.7)' },
              '70%': { boxShadow: '0 0 0 8px rgba(235, 189, 64, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(235, 189, 64, 0)' },
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              textAlign: 'center',
            }}
          >
            Welcome to our new Vector Atlas platform. Please explore our updated
            dataset and new maps. PS: The download functionality is currently
            under development and will be available soon.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: 'center',
            }}
          >
            <a
              href="mailto:vectoratlas@icipe.org?subject=Vector Atlas Feedback"
              style={{
                fontWeight: 900,
                color: '#ebbd40',
                textDecoration: 'underline',
              }}
            >
              If you have any comments or notice any bugs, please let us know at
              vectoratlas@icipe.org.
            </a>
          </Typography>
        </Box>
        <IconButton
          size="medium"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          sx={{ color: 'inherit', p: '4px', ml: 2 }}
        >
          <CloseIcon sx={{ fontSize: '1.5rem' }} />
        </IconButton>
      </Box>
    </Snackbar>
  );
}
