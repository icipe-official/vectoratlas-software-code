import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#038543',
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
});

export default theme;