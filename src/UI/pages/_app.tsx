// @ts-ignore
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';
import store from '../state/store';
import NavBar from '../components/shared/navbar';
// import Footer from '../components/shared/footer';
import { useEffect } from 'react';
// @ts-ignore
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Script from 'next/script';
import { getMapStyles } from '../state/map/actions/getMapStyles';
import { getTileServerOverlays } from '../state/map/actions/getTileServerOverlays';
import { getApiVersion } from '../state/config/actions/getApiVersion';
import { getFeatureFlags } from '../state/config/actions/getFeatureFlags';
import { getUiVersion } from '../state/config/actions/getUiVersion';
import { NextIntlProvider } from 'next-intl';
// import LanguageSwitcher from '../components/shared/LanguageSwitcher';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import { getOccurrenceData } from '../state/map/actions/getOccurrenceData';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(getFeatureFlags());
    store.dispatch(getMapStyles());
    store.dispatch(getUiVersion());
    store.dispatch(getApiVersion());
    store.dispatch(getTileServerOverlays());
    // store.dispatch(getOccurrenceData());
  }, []);
  //const messages = {}; //await getMessages();
  const { locale, pathname } = useRouter();

  const noMarginTopPaths = ['/map', '/'];
  return (
    <>
      <Script
        async
        defer
        data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_ID}
        src={process.env.NEXT_PUBLIC_ANALYTICS_URL}
      />
      {/* @ts-ignore */}
      <NextIntlProvider messages={pageProps?.messages} locale={locale || 'en'}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <UserProvider>
              <CssBaseline />
              <Head>
                <title>Vector Atlas</title>
                <meta name="description" content="Vector Atlas" />
                <link rel="icon" href="/Animals-Mosquito-icon.png" />
              </Head>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  height: pathname === '/map' ? '100vh' : 'auto',
                }}
              >
                <NavBar />
                <div
                  style={{
                    zIndex: 1,
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    overflow: pathname === '/map' ? 'hidden' : 'visible',
                    marginTop: !noMarginTopPaths.includes(pathname)
                      ? '64px'
                      : '0',
                  }}
                >
                  <Component {...pageProps} />
                </div>
              </div>
            </UserProvider>
          </ThemeProvider>
        </Provider>
      </NextIntlProvider>

      <ToastContainer
        position="top-right"
        autoClose={5000}
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
