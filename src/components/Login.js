import { AsyncStorage } from 'react-native';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client';
import sha256 from 'sha256';
import validator from "email-validator"

if(!global._babelPolyfill) { require('babel-polyfill'); }

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';


// Need to require instead of import so we can set the user agent first
const io = require('socket.io-client');
const host = 'http://localhost:3030';
let socket = io(host, { transports: ['websocket'] });

// Set up Feathers client side
let app = feathers();
// Register hooks module
app.configure(hooks());
// Register socket.io
app.configure(socketio(socket));
// Set up authentication with a store to cache your access token
app.configure(authentication({ storage: AsyncStorage }));

// Authenticating using a email and password
// app.authenticate({
//   "email": "user65@test.com",
//   "password": "admin",
//   "strategy":"local"
//   }).then(function(result){
//     console.log('Authenticated!', result);
//     // Find our users on the server via sockets
//     // app.service('users').find({}).then(function(users){
//     //   console.log('Users!', users);
//     // });
//   }).catch(function(error){
//     console.error('Error authenticating!', error);
//   });



class Login extends Component {
  constructor () {
    super();

    this.state = {
      email: '',
      password: '',
      errors: '',
      showProgress: false
    }
  }

  async onRegisterPressed() {
    validator.validate_async(this.state.email, async (err, isValidEmail) => {

      if (isValidEmail) {
        this.setState({showProgress: true})
        app.authenticate({
          "email": this.state.email.toLowerCase(),
          "password": this.state.password,
          "strategy":"local"
          }).then(function(result){
            console.log('Authenticated!', result);
            // Find our users on the server via sockets
            // app.service('users').find({}).then(function(users){
            //   console.log('Users!', users);
            // });
          }).catch(function(error){
            console.error('Error authenticating!', error);
          });

      }else{
        this.setState({errors: 'Email is invalid'})
      }
    });
   }

  checkUser(){

    console.log(app.get('accessToken'));
    // app.logout()
  }

  render(){
    return(
      <View style={styles.container}>
        <TextInput
          onChangeText={(val)=> this.setState({email: val})}
          style={styles.input} placeholder="Email"
           keyboardType="email-address">
        </TextInput>
        <TextInput
          onChangeText={ (text)=> this.setState({password: text}) }
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}>
        </TextInput>
        <TouchableHighlight onPress={this.onRegisterPressed.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.checkUser.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Check user
          </Text>
        </TouchableHighlight>
        <Text style={styles.error}>
          {this.state.errors}
        </Text>
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
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
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
  },
  heading: {
    fontSize: 30,
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  }
});

Login.propTypes = {
  navigation: PropTypes.object.isRequired,
};

Login.navigationOptions = {
  title: 'Log In',
};

export default Login
