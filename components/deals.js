

import React from 'react-native'
import _ from 'lodash'

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

import Deal from './deal';
module.exports=class Deals extends React.Component{
	// getChildQueries() {
	// 	return props.children.map(child =>
	// 			child.getQuery ? child.getQuery() : []
	// 		);
	// }
	// getQuery() {	
	// 	// return ['deals', {from: 0, to: 9}, getChildQueries];
	// 	return getChildQueries().map(childQueryArray =>
				
	// 		)
	// }
	state={}
	render(){
	    console.log('rendering Deals component');
		return (
				<ScrollView contentContainerStyle={{marginTop:100}}>
					{_.values(this.props.deals).map(deal =>// console.log('deal in Deals ', deal) ||
						deal && deal.title ? <Deal deal={deal} /> : false
					)}
				</ScrollView>
     		)
	}
}

