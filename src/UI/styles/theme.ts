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
    }
  },
  typography: {
    fontFamily: 'PgfNowMedium, Arial'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'PgfNowMedium';
          font-style: normal;
          font-display: swap;
          font-weight: 100;
          src: url('/fonts/pgf-now-medium.ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
});

export default theme;