import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import reducer from './redux';
import LoginComponent from './LoginComponent';

const client = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  responseType: 'json'
});

const store = createStore(reducer,
  applyMiddleware(axiosMiddleware(client)),
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LoginComponent />
      </Provider>
    );
  }
}
