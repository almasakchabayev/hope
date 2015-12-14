import React from 'react-native'
let UIManager = require('NativeModules').UIManager;
let {
  Text,
  View,
  NavigatorIOS,
  TabBarIOS,
  StatusBarIOS,
  Image,
  LayoutAnimation
} = React;
import DealsContainer from './dealsContainer'
module.exports=class TabApp extends React.Component{
	state={selectedTab:'search'}
	render(){
	    console.log('rendering TabApp component');
		return (
			<TabBarIOS selectedTab={this.state.selectedTab} tintColor={'#0679a2'} translucent={true}>
		        <TabBarIOS.Item
		          selected={this.state.selectedTab==='search'}
		          title='Search'
		          icon={{uri:"searchA",isStatic:true}}	          
		          onPress={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
		          	this.setState({selectedTab: 'search'})}}>   	
					<DealsContainer deals$={this.props.state$.pluck('featuredDeals')}/>
		        </TabBarIOS.Item>
	       		<TabBarIOS.Item
					selected={this.state.selectedTab==='featured'}
					title='Featured'
					icon={{uri:"starA",isStatic:true}}
					selectedIcon={{uri:"starBA",isStatic:true}}
					onPress={() => {this.setState({selectedTab: 'featured',})}}>			
		  				<View style={{flex:1,backgroundColor:'red'}}> 
		  					<DealsContainer deals$={this.props.state$.pluck('dealsById')}/>
		  				</View>
		        </TabBarIOS.Item>
				 <TabBarIOS.Item
				  title='Activity'
				  selected={this.state.selectedTab==='notifications'}
				  icon={{uri:"notificationA",isStatic:true}}
				  selectedIcon={{uri:"notificationBA",isStatic:true}}
				  onPress={() => {this.setState({selectedTab: 'notifications' });}}>
				  		<Image style={{width:300,height:400}} source={{uri:"https://besmart.kz/media/events/images/218/109352.jpg.633x370_q100_crop-smart.jpg"}}/>
				</TabBarIOS.Item>
	            <TabBarIOS.Item
	              selected={this.state.selectedTab==='profile'} icon={{uri:"profileA",isStatic:true}}
		          selectedIcon={{uri:"profileBA",isStatic:true}} title='Profile' 
		          onPress={() => {this.setState({selectedTab: 'profile'})}}>
		          			<Image style={{width:300,height:400}} source={{uri:'http://lh6.googleusercontent.com/-TtMGQekD3JA/AAAAAAAAAAI/AAAAAAAAEGE/KXULg3Psnd0/s80-c/photo.jpg'}}/>
			        </TabBarIOS.Item>
     		</TabBarIOS> 		
     		)
	}
}