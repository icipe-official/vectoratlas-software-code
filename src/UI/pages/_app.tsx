import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from "@apollo/client";
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';
import client from "../api/apollo";
import store from '../state/store';
import { getApiVersion, getFeatureFlags, getUiVersion } from '../state/configSlice';

function MyApp({ Component, pageProps }: AppProps) {
  store.dispatch(getFeatureFlags());
  store.dispatch(getUiVersion());
  store.dispatch(getApiVersion());
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default MyApp;
