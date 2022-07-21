import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from "@apollo/client";
import { Provider } from 'react-redux';
import client from "../api/apollo";
import store from '../state/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  );
}

export default MyApp;
