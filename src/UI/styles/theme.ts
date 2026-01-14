import React from 'react';
import {
  createTheme,
  ThemeOptions,
  responsiveFontSizes,
} from '@mui/material/styles';
import { red } from '@mui/material/colors';

import { TypographyOptions } from '@mui/material/styles/createTypography';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    sectionTitle: true;
  }
}

interface ExtendedTypographyOptions extends TypographyOptions {
  sectionTitle: React.CSSProperties;
}

// Create a theme instance.
const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: '#038543',
        light: '#0385430a',
      },
      secondary: {
        main: '#ebbd40',
      },
      error: {
        main: red.A400,
      },
      success: {
        main: '#038543',
      },
      info: {
        main: '#808285',
      },
    },
    typography: {
      fontFamily: 'Poppins',
      body1: {
        fontFamily: 'Poppins',
      },
      h5: {
        fontFamily: 'Poppins',
        fontWeight: 600,
      },
      sectionTitle: {
        fontSize: '1.5em',
        fontFamily: 'Poppins',
        fontWeight: 600,
        paddingTop: '25px',
        paddingInline: '35px',
      },
    } as ExtendedTypographyOptions,

    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            margin: '5px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            margin: '8px',
          },
        },
        defaultProps: {
          elevation: 2,
        },
      },
    },
  } as ThemeOptions)
);

export default theme;
