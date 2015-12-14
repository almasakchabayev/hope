import React from 'react-native'
let UIManager = require('NativeModules').UIManager;
let {
  Text,
  View,
  NavigatorIOS,
  TabBarIOS,
  ScrollView,
  StatusBarIOS,
  TouchableOpacity,
  LayoutAnimation
} = React;
import Combinator from './combinator';
import Deals from './deals';
import { data$, action$} from '../model';
export default class DealsContainer extends React.Component{
	componentWillMount() {
		data$.onNext({
			featuredDeals: {
				isFetching: true
			}
		})
		setTimeout(() => action$.onNext({
			type: 'call',
			path: [
				['featuredDeals', 'edges', { from: 0, to : 2} , ['title']],
				['featuredDeals','hasData']
			],
			value: { city: 'Almaty' }
		}),1000)
	}
	loadMore(){
		data$.onNext({
			featuredDeals: {
				isFetching: true
			}
		})
		setTimeout(() => action$.onNext({
			type: 'call',
			path: [
				['featuredDeals', 'edges', { from: 0, to : 3} , ['title']],
				['featuredDeals', 'hasData']
			],
			value: { city: 'Almaty' }
		}),1000)

	}
	render(){
			return <Combinator>
				<View style={{flex:1}}>
					{
						this.props.deals$.pluck('edges').map(deals => 
							<Deals deals={deals}/>
						)
					}
					{
						this.props.deals$.pluck('isFetching').map(isFetching =>
							isFetching && <Text style={{ marginTop: 50 }}>Fetching...</Text>
						)
					}

					<TouchableOpacity style={{flex:1}} onPress={this.loadMore.bind(this)}><Text>load more</Text></TouchableOpacity>
				</View>
			</Combinator>	
	}
}
