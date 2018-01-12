import React from 'react';
import {
	StyleSheet,
	PixelRatio,
	Platform,
	Text,
	TouchableOpacity,
	Image,
	View,
	Dimensions,
	Alert
} from 'react-native';
import PopupDialog from 'react-native-popup-dialog';


const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;
const {width,height} = Dimensions.get('window')

const pink = '#ff4682'


const getRatio = () => {
		return Math.round(PixelRatio.get())
}

const isIPad = (() => {
		if (Platform.OS !== 'ios') return false;

		if (height > width && width < PAD_WIDTH) {
				return false;
		}
		return true;
})();

const getStyle = (x, name, isIPad) => {
		if (isIPad) {
				return styles[name + 'Pad']
		} else {
				return styles[name + 'x' + x]
		}
}

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cash:'5542464'
		};
		this.generate = () => this.setState((prev) => {return {cash : Math.floor(Math.random() * 9000000) + 1000000}});
		// this.generate= this.generate.bind(this)
	}
	componentWillMount() {
		// this.setState((prev) => {return {cash : Math.floor(Math.random() * 9000000) + 1000000}});
	}
	render() {
		
		let cash = this.state.cash
		console.log(this.state);
		console.log(this.generate());
		
		return (
			<View style={styles.container}>
				<Text style={[styles.title,getStyle(getRatio(), 'title', isIPad)]}>Ripple Generator</Text>
				<View style={{alignSelf:'stretch',alignContent: 'center',justifyContent: 'center'}}>
					<Text style={[styles.subTitle,getStyle(getRatio(), 'subTitle', isIPad)]}>Balance:</Text>
					<Text style={[styles.balance,getStyle(getRatio(), 'balance', isIPad)]}>0.0000457 XRP</Text>
				</View>
				<View style={{
						flex: 1,
						alignItems: 'center',
						justifyContent:'flex-start'
					}}>
					<Image source={require("./src/Images/MainCard.png")} style={[styles.MainCard,getStyle(getRatio(), 'MainCard', isIPad)]}/>

					<Text style={[styles.generatedNumber,getStyle(getRatio(), 'generatedNumber', isIPad)]}>{this.state.cash}</Text>

					<Image source={require("./src/Images/Circle1.png")} style={[styles.circle,getStyle(getRatio(), 'circle', isIPad)]}/>

					<Text style={[styles.timer,getStyle(getRatio(), 'timer', isIPad)]}>0:41:10</Text>

					<TouchableOpacity
						onPress={this.generate()}
						style={[styles.button,getStyle(getRatio(), 'button', isIPad)]}>
							<Text style={[styles.buttonText,getStyle(getRatio(), 'buttonText', isIPad)]}>Generate</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => Alert.alert(
							'Withdraw your cash',
							'You have '+ cash +' XRP but for withdraw you need 1.0000000 XRP',
							[
								{text: 'Cancel', onPress: () => console.log('Cancel Button Pressed'), style: 'cancel'},
						   
								{text: 'OK', onPress: () => console.log('OK ButtonPressed')},
							  ]
							)}
						style={[styles.button,getStyle(getRatio(), 'button', isIPad)]}>
							<Text style={[styles.buttonText,getStyle(getRatio(), 'buttonText', isIPad)]}>Generate</Text>
					</TouchableOpacity>

				</View>
			</View>
		);
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent:'center'
	},
	title:{
		color:pink,
		paddingTop:45,
		paddingHorizontal:40,
		textAlign: 'left',
		alignSelf: 'stretch',
		fontFamily:'System',
		fontWeight:"800",
		fontSize:30
	},
	textContainer:{
		alignSelf:'stretch',
		alignContent: 'center',
		justifyContent: 'center',
	},
	subTitle:{
		color:pink,
		left:40,
		top:5,
		width:width,
		position:'absolute',
		fontFamily:'System',
		fontWeight:"normal",
		fontSize:20,
		backgroundColor:'transparent'
	},
	balance:{
		color:pink,
		right:40,
		top:5,
		width:width,
		textAlign: 'right',
		position:'absolute',
		fontFamily:'System',
		fontWeight:"normal",
		fontSize:20,
		backgroundColor:'transparent'
	},
	generatedNumber:{
		color:"#fff",
		fontSize:42,
		fontWeight:'800',
		backgroundColor:'transparent',
		marginTop:125
	},
	button:{
		backgroundColor:pink,
		justifyContent:'center',
		alignItems:'center',
		borderRadius:10,
		width:255,
		// marginTop:170,
		height:50
	},
	buttonText:{
		color:'#fff',
		fontFamily:'System',
		fontWeight:"700",
		fontSize:25,
		backgroundColor:'transparent'
	},
	timer:{
		marginTop:130,
		color:'#fff',
		fontFamily:'System',
		fontWeight:"600",
		fontSize:32,
		backgroundColor:'transparent'
	},
	circle:{
		position:'absolute',
		top:220
	},
	MainCard:{
		position:'absolute',
		top:40,
		resizeMode:'stretch',
	},
	MainCardx3:{
		resizeMode:'stretch'
	},
});
