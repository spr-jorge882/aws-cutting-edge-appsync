import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from "graphql-tag";
import Vue from 'vue'

const APPSYNC_URI = 'https://ycbelti755gonbamz4blsdriuu.appsync-api.eu-west-1.amazonaws.com/graphql';
const APPSYNC_APIKEY = 'da2-p2mz2252svespmtyr3bwcmbw2e';


const httpLink = createHttpLink({
  uri: APPSYNC_URI,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      'x-api-key': APPSYNC_APIKEY
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

var votingresults = new Vue({
  el: '#votingresults',
  data () {
    return {
      loading: false,
      items: null,
      error: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.error = this.items = null
      this.loading = true
      client
        .query({
          query: gql`
            {
              getVotingResults(nextToken: null) {
                items {
                  service
                  upvotes
                }
                nextToken
              }
            }
          `
        })
        .then(result => {
          this.loading = false;
          this.items = result.data.getVotingResults.items;
        })
        .catch(err => {
          this.loading = false;
          this.error = err;
        });
    }
  }
});

var vote = new Vue({
  el: '#vote',
  data () {
    return {
      loading: false,
      items: null,
      error: null,
      service: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    vote() {
      client
        .mutate({
          mutation: gql`
            mutation {
              vote(service: "${this.service}")
            }
          `
        })
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchData () {
      this.error = this.items = null
      this.loading = true
      client
        .query({
          query: gql`
            {
              getServices(nextToken: null) {
                items 
                nextToken
              }
            }
          `
        })
        .then(result => {
          this.loading = false;
          this.items = result.data.getServices.items;
        })
        .catch(err => {
          this.loading = false;
          this.error = err;
        });
    }
  }
});
