import { AsyncStorage } from 'react-native';
import sha256 from 'sha256';
import validator from "email-validator"


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';




class Registration extends Component {
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
        //Do something with isValidEmail
      if (isValidEmail) {
        this.setState({showProgress: true})
        try {
          let response = await fetch('http://localhost:3030/users', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                 "emails":{
                 	"address": this.state.email
                 },
                 "services":{
                 	 "password":{
                 	    "bcrypt": sha256(this.state.password)
                 	}
                 },
                 "strategy":"local"
                 })
            });
          let res = await response.text();
          if (response.status >= 200 && response.status < 300) {
              let accessToken = res;
              console.log(accessToken);
              this.setState({errors: ''})
          } else {
              //Handle error
              let error = res;
              console.log(error);
             //  throw error;
          }
        } catch(errors) {
          //errors are in JSON form so we must parse them first.
          let formErrors = JSON.parse(errors);
          //We will store all the errors in the array.
          this.setState({errors: ''})
          this.setState({showProgress: false});
        }
      }else{
        this.setState({errors: 'Email is invalid'})
      }
    });
   }


  render(){
    return(
      <View style={styles.container}>
        <TextInput
          onChangeText={(val)=> this.setState({email: val})}
          style={styles.input} placeholder="Email">
        </TextInput>
        <TextInput
          onChangeText={ (text)=> this.setState({password: text}) }
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}>
        </TextInput>
        <TouchableHighlight onPress={this.onRegisterPressed.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Register
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

export default Registration
