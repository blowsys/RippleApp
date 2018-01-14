import React from 'react';
import { Animated, Text, View, Easing } from 'react-native';

export default class FadeInView extends React.Component {
  state = {
    opacity: new Animated.Value(0),
    transform: new Animated.ValueXY({x:0,y:0})
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  method() {
    Animated.sequence([
    Animated.timing(
      this.state.opacity,
      {
        toValue: 1,
        duration: 200
      }),
    Animated.spring(
      this.state.transform,
      {
        toValue: {x:0,y:-25},
        duration: 150,
        bounciness:10,
      }),
    Animated.parallel([
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        duration: 200
      }),
    Animated.spring(
      this.state.transform,
      {
        toValue: {x:0,y:-50},
        duration: 100,
        bounciness:10,
      })
    ]),
    Animated.timing(
      this.state.transform,
      {
        toValue: {x:0,y:0},
        duration: 0,
      }),
    
    ]).start()
  }

  render() {
    let { opacity,transform } = this.state;

    return (
      <Animated.View style={{
          ...this.props.style,
          opacity: opacity,
          transform:[
            {
              translateY:transform.y
            }
          ]
        }}>
        {this.props.children}
      </Animated.View>
    );
  }
}