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
import NavBar from '../components/shared/navbar';
import Footer from '../components/shared/footer';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { getMapStyles } from '../state/map/actions/getMapStyles';
import { getTileServerOverlays } from '../state/map/actions/getTileServerOverlays';

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
        position="top-right"
        autoClose={2000}
        closeOnClick
        hideProgressBar={true}
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}

export default MyApp;
