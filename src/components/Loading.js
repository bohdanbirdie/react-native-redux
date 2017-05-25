import React from 'react';
import { View, Text } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

class Loading extends React.Component {

  constructor(props) {
    super();
    this.state = {
      visible: true
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
      </View>
    );
  }
}

export default Loading;
