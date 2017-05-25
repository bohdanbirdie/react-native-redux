import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  View,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import Index from './components/Index';
import Registration from './components/Registration';
import Login from './components/Login';


const babynoggin = StackNavigator({
  Index: { screen: Index },
  Login: { screen: Login },
  Registration: { screen: Registration },
});

AppRegistry.registerComponent('babynoggin', () => babynoggin);
