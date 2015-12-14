/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;
let TabApp =require('./components/tab-app')

import { state$ } from './model';

var hope = React.createClass({
  render: function() {
    console.log('rendering Root component');
    return (
      <View style={styles.container}>
        <TabApp state$={state$}/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('hope', () => hope);
