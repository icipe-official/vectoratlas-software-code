import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { UserProvider } from '@auth0/nextjs-auth0';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';
import store from '../state/store';
import {
  getApiVersion,
  getFeatureFlags,
  getUiVersion,
} from '../state/configSlice';
import { getMapStyles, getTileServerOverlays } from '../state/map/mapSlice';
import NavBar from '../components/shared/navbar';
import Footer from '../components/shared/footer';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(getFeatureFlags());
    store.dispatch(getMapStyles());
    store.dispatch(getUiVersion());
    store.dispatch(getApiVersion());
    store.dispatch(getTileServerOverlays());
  }, []);
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <UserProvider>
            <CssBaseline />
            <Head>
              <title>Vector Atlas</title>
              <meta name="description" content="Vector Atlas" />
              <link rel="icon" href="/Animals-Mosquito-icon.png" />
            </Head>
            <NavBar />
            <Component {...pageProps} />
            <Footer />
          </UserProvider>
        </ThemeProvider>
      </Provider>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        closeOnClick
        hideProgressBar={true}
        pauseOnHover
        draggable
      />
    </>
  );
}

export default MyApp;
