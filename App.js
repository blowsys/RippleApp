import React from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';

const { width, height } = Dimensions.get('window')

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require("./src/MainCard.png")} style={{height:200,width:200}}></Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
