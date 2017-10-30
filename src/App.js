import React, { Component } from 'react';
// import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import './utils/reactotron'; // This needs to be before the store
import './utils/globals';

import LoadingScreen from './containers/LoadingScreen';

import getStore from './store';

import AppWithNavigationState from './AppNavigator';

// TODO: Add loading stuff with redux persist
class App extends Component {
  state = { store: null };
  
  componentDidMount() {
    getStore((store) => this.setState({ store }));
  }
  
  render() {
    if (!this.state.store) {
      return <LoadingScreen />;
    }
    return (
      <Provider store={this.state.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

// AppRegistry.registerComponent('App', () => App);

export default App;