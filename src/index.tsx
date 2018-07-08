// Vendors
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

// Components
import App from './App';

// CSS
import './index.css';



const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

const httpLink = new HttpLink({
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
  uri: url
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: httpLink
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
