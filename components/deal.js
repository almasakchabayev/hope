

import React from 'react-native'

let UIManager = require('NativeModules').UIManager;
let {
  Text,
  View,
  NavigatorIOS,
  TabBarIOS,
  ScrollView,
  StatusBarIOS,
  LayoutAnimation
} = React;
// import action$ from './action';
module.exports=class Deal extends React.Component{
	getQuery() {
		return {
			dependsOnParent: ['title'],
			fromRoot: []
		}
	}
	state={}
	render(){
	    console.log('rendering Deal component');
		return (
				<View style={{marginTop:10,marginLeft:120}}>
					<Text>{this.props.deal.title}</Text>
				</View>
     		)
	}
}

