import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#038543',
      light: '#0385430a'
    },
    secondary: {
      main: '#ebbd40',
    },
    error: {
      main: red.A400,
    },
    success: {
      main: '#038543'
    },
    info: {
      main: '#808285'
    }
  },
  typography: {
    fontFamily: 'Poppins, ',
    body1: {
      fontFamily: 'Poppins'
    },
    h5: {
      fontFamily: 'Poppins',
      fontWeight: 600
    }
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          margin: '5px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          margin: '8px'
        }
      },
      defaultProps: {
        elevation: 2
      }
    }
  },
});

export default theme;