import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, DrawerNavigator } from 'react-navigation';

import Root from '../components/Root';
import Registration from '../components/Registration';
import Login from '../components/Login';
import LoginScreen from '../components/LoginScreen';
import Loading from '../components/Loading'


export const AppNavigator = StackNavigator({
  Main: { screen: Root, },
  Login: { screen: Login },
  Registration: { screen: Registration },
});

const AppWithNavigationState = ({ dispatch, nav, auth }) => {
  console.log(auth);
  return(
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
  )
};

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
  auth: state
});


export default connect(mapStateToProps)(AppWithNavigationState);
