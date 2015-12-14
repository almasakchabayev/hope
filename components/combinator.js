import React from 'react-native';
import combineTemplate from './combineTemplate';
let {LayoutAnimation}=React
class Combinator extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Keep track of whether the component has mounted
    this.componentHasMounted = false;

    // Subscribe to child prop changes so we know when to re-render
    this.subscription = combineTemplate(props.children).subscribe(
      children =>{
        LayoutAnimation.easeInEaseOut()
        !this.componentHasMounted
          ? this.state = children
          : this.setState(children)
      }
    );
  }
  componentDidMount() {
    this.componentHasMounted = true;
  }
  componentWillUnmount() {
    // Clean-up subscription before un-mounting
    this.subscription.dispose();
  }
  render() {
    return this.state;
  }
}

export default Combinator;