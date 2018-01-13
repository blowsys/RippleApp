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
import moment from 'moment';

const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;
const {width, height} = Dimensions.get('window');
const pink = '#ff4682';

const getRatio = () => {
    return Math.round(PixelRatio.get());
};

const isIPad = (() => {
    if (Platform.OS !== 'ios') return false;

    if (height > width && width < PAD_WIDTH) {
        return false;
    }
    return true;
})();

const getStyle = (x, name, isIPad) => {
    if (isIPad) {
        return styles[name + 'Pad'];
    } else {
        return styles[name + 'x' + x]
    }
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cash: '00000',
            balance: 0,
            allowGenerate: true,
            timer: '00 : 00 : 00'
        };
        // this.generate= this.generate.bind(this)
    }

    runTimer() {
        const time = moment(new Date());
        const finishedTime = moment(time).add(1, 'hour').format('HH:mm:ss');
        console.log(time);
        console.log(finishedTime);
        // let time = 60 * 60;
        // console.log(time);
        // console.log(moment(time).format('HH:mm:ss'));
        // const minVal = 1000;
        // setInterval(() => {
        //
        // }, minVal)
    }

    generate() {
        if (!this.state.allowGenerate) return false;
        this.runTimer();
        const rndNumber = rundomizer();
        if (9000 > rndNumber) {
            console.log(this.state.balance);
            return this.setState({
                cash: rndNumber,
                balance: (parseFloat(this.state.balance) + 0.00001).toFixed(5)
            });
        }
        return this.setState({
            cash: rndNumber,
            balance: (parseFloat(this.state.balance) + 0.00002).toFixed(5)
        });

        // Generate Random Number
        function rundomizer() {
            return Math.floor(Math.random() * 10000);
        }

        // this.setState((prev) => {return {cash : Math.floor(Math.random() * 9000000) + 1000000}});
    }

    componentWillMount() {
        // this.setState((prev) => {return {cash : Math.floor(Math.random() * 9000000) + 1000000}});
    }

    render() {

        let {
            cash,
            balance,
            timer
        } = this.state;
        console.log(this.state);

        return (
            <View style={styles.container}>
                <Text style={[styles.title, getStyle(getRatio(), 'title', isIPad)]}>Ripple Generator</Text>
                <View style={{alignSelf: 'stretch', alignContent: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.subTitle, getStyle(getRatio(), 'subTitle', isIPad)]}>Balance:</Text>
                    <Text style={[styles.balance, getStyle(getRatio(), 'balance', isIPad)]}>{this.state.balance}
                        XRP</Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Image source={require("./src/Images/MainCard.png")}
                           style={[styles.MainCard, getStyle(getRatio(), 'MainCard', isIPad)]}/>

                    <Text
                        style={[styles.generatedNumber, getStyle(getRatio(), 'generatedNumber', isIPad)]}>{this.state.cash}</Text>
                    <Text style={[styles.timer, getStyle(getRatio(), 'timer', isIPad)]}>{timer}</Text>
                    {/*<Image source={require("./src/Images/Circle1.png")} style={[styles.circle,getStyle(getRatio(), 'circle', isIPad)]}/>*/}

                    <TouchableOpacity
                        onPress={this.generate.bind(this)}
                        style={[styles.button, getStyle(getRatio(), 'button', isIPad)]}>
                        <Text style={[styles.buttonText, getStyle(getRatio(), 'buttonText', isIPad)]}>Generate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Alert.alert(
                            'Withdraw your cash',
                            `You have ${balance} XRP but for withdraw you need 1.0000000 XRP`,
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Button Pressed'), style: 'cancel'},

                                {text: 'OK', onPress: () => console.log('OK ButtonPressed')},
                            ]
                        )}
                        style={[styles.button, getStyle(getRatio(), 'button', isIPad)]}>
                        <Text style={[styles.buttonText, getStyle(getRatio(), 'buttonText', isIPad)]}>Withdraw</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: pink,
        paddingTop: 45,
        paddingHorizontal: 40,
        textAlign: 'left',
        alignSelf: 'stretch',
        fontFamily: 'System',
        fontWeight: "800",
        fontSize: 30
    },
    textContainer: {
        alignSelf: 'stretch',
        alignContent: 'center',
        justifyContent: 'center',
    },
    subTitle: {
        color: pink,
        left: 40,
        top: 5,
        width: width,
        position: 'absolute',
        fontFamily: 'System',
        fontWeight: "normal",
        fontSize: 20,
        backgroundColor: 'transparent'
    },
    balance: {
        color: pink,
        right: 40,
        top: 5,
        width: width,
        textAlign: 'right',
        position: 'absolute',
        fontFamily: 'System',
        fontWeight: "normal",
        fontSize: 20,
        backgroundColor: 'transparent'
    },
    generatedNumber: {
        color: "#fff",
        fontSize: 42,
        fontWeight: '800',
        backgroundColor: 'transparent',
        marginTop: 125
    },
    button: {
        backgroundColor: pink,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 255,
        height: 50
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'System',
        fontWeight: "700",
        fontSize: 25,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
    },
    timer: {
        color: '#fff',
        paddingTop: 25,
        paddingBottom: 25,
        fontFamily: 'System',
        fontWeight: "600",
        fontSize: 32,
        backgroundColor: 'transparent'
    },

    timerPart: {},

    circle: {},
    MainCard: {
        position: 'absolute',
        top: 40,
        resizeMode: 'stretch',
    },
    MainCardx3: {
        resizeMode: 'stretch'
    },
});
