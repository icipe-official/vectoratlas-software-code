import { ApolloClient, DefaultOptions, InMemoryCache } from '@apollo/client';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
};

const client = new ApolloClient({
  uri: '/vector-api/graphql',
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default client;
