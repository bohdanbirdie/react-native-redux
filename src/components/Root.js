import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';

import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client';

if(!global._babelPolyfill) { require('babel-polyfill'); }


// Need to require instead of import so we can set the user agent first
const io = require('socket.io-client');
const host = 'http://localhost:3030';
let socket = io(host, { transports: ['websocket'] });

let app = feathers();
app.configure(hooks());
app.configure(socketio(socket));
app.configure(authentication({ storage: AsyncStorage }));


class Root extends Component {
  constructor () {
    super();

    this.state = {
      email: '',
      password: '',
      errors: '',
      showProgress: false,
      loggedIn: false
    }
    app.passport.getJWT().then(token => token && this.props.login);
  }


  static navigationOptions = {
    title: 'Welcome',
  };

  checkUser(){
    console.log(app.get('accessToken'));
  }

  logout(){
    app.logout();
    app.passport.getJWT()
      .then(token => this.setState({isLoggedIn: false}))
      .catch((err) => { console.log(err);});
  }

  render(){
    const { navigate } = this.props.navigation;
    if (this.state.isLoggedIn) {
      console.log(this.state.isLoggedIn);
      return(
          <View>
            <Text>You are logged in</Text>
            <TouchableHighlight
              onPress={this.logout.bind(this)}
              style={styles.button}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableHighlight>
          </View>
      )
    }
    return(
      <View style={styles.container}>
        <TouchableHighlight
          onPress={() => navigate('Registration')}
          style={styles.button}>
          <Text style={styles.buttonText}>Let's get started</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => navigate('Login')}
          style={styles.button}>
          <Text style={styles.buttonText}>Existing user sign in</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.checkUser}
          style={styles.button}>
          <Text style={styles.buttonText}>Check user</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingTop: 80
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  }
})

Root.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  loginScreen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});


const mapDispatchToProps = dispatch => ({
  login: () => dispatch({ type: 'isLoggedIn' }),
  logout: () => dispatch({ type: 'Logout' }),
  loginScreen: () =>
    dispatch(NavigationActions.navigate({ routeName: 'Login' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
