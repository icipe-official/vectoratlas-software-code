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
import Footer from '../components/shared/footer';
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
import { Stack, useMediaQuery } from '@mui/material';
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

  // True on screens narrower than the MUI "sm" breakpoint (600px)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Pages that run edge to edge: no page-level margin or padding
  const fullBleedPaths = ['/map', '/'];
  const isFullBleed = fullBleedPaths.includes(pathname);

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

                  // height: pathname === '/map' ? '100vh' : 'auto',
                }}
              >
                <NavBar />
                <div
                  style={{
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    flex: pathname === '/map' ? 'none' : 1,
                    height: pathname === '/map' ? '100vh' : 'auto',
                    // overflow: pathname === '/map' ? 'hidden' : 'visible',

                    // The navbar is sticky, so it already takes its own space.
                    // The old 64px margin added a gap below it. Kept on desktop,
                    // removed on phones.
                    marginTop: isMobile
                      ? '0'
                      : pathname === '/map' || pathname === '/'
                      ? '0'
                      : '64px',

                    // Side padding on phones for non-full-bleed pages
                    paddingLeft: isMobile && !isFullBleed ? '8px' : '0',
                    paddingRight: isMobile && !isFullBleed ? '8px' : '0',
                    boxSizing: 'border-box',
                    width: '100%',
                  }}
                >
                  <Component {...pageProps} />
                </div>
                <Footer />
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
