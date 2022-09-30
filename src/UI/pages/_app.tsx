import '../src/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { UserProvider } from '@auth0/nextjs-auth0';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../src/styles/theme';
import client from '../src/api/apollo';
import store from '../src/state/store';
import {
  getApiVersion,
  getFeatureFlags,
  getUiVersion,
} from '../src/state/configSlice';
import { getMapStyles, getTileServerOverlays } from '../src/state/mapSlice';
import NavBar from '../src/components/shared/navbar';
import Footer from '../src/components/shared/footer';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(getFeatureFlags());
    store.dispatch(getMapStyles());
    store.dispatch(getUiVersion());
    store.dispatch(getApiVersion());
    store.dispatch(getTileServerOverlays());
  }, []);
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <UserProvider>
            <CssBaseline />

            <Head>
              <title>VA</title>
              <meta name="description" content="Vector Atlas UI" />
              <link rel="icon" href="/Animals-Mosquito-icon.png" />
            </Head>

            <NavBar />

            <Component {...pageProps} />

            <Footer />
          </UserProvider>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default MyApp;
