import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import creacteLogger from 'redux-logger';

import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';

class babynoggin extends React.Component {
  store = createStore(AppReducer);
  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('babynoggin', () => babynoggin);

// export default ReduxExampleApp;
