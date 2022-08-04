import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from "@apollo/client";
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';
import client from "../api/apollo";
import store from '../state/store';
import { getApiVersion, getFeatureFlags, getUiVersion } from '../state/configSlice';
import NavBar from '../components/shared/navbar';
import Footer from '../components/shared/footer';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(getFeatureFlags());
    store.dispatch(getUiVersion());
    store.dispatch(getApiVersion());
  }, []);
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          <Head>
            <title>VA</title>
            <meta name="description" content="Vector Atlas UI" />
            <link rel="icon" href="/Animals-Mosquito-icon.png" />
          </Head>

          <NavBar />

          <Component {...pageProps} />

          <Footer />
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default MyApp;
