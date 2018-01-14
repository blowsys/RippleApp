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
    Alert,
    Animated,
    AsyncStorage,
} from 'react-native';
import moment from 'moment';
import CountText from './src/components/countText'


const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;
const {width, height} = Dimensions.get('window');


//Style variables
const pink = '#ff4682';
const disabledBackground = '#dddddd';
const disabledFont = '#000' 


const getRatio = () => {
    return Math.round(PixelRatio.get());
};

const isIPad = (() => {
    if ('ios' !== Platform.OS) return false;

    if (height > width && width < PAD_WIDTH) {
        return false;
    }
    return true;
})();

const getStyle = (x, name, isIPad) => {
    if (isIPad) {
        return styles[name + 'Pad'];
    } else {
        return styles[name + 'x' + x];
    }
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // animated:new Animated.Value(0),
            cash: '00000',
            balance: 0,
            allowGenerate: true,
            timer: '00:00:00',
            timestamp: 0
        };
    }

    runTimer() {
        this.setState({
            allowGenerate: false
        });
        const intervalFunc = timestamp => {
            const minVal = 1000;
            let result;
            const interval = setInterval(() => {
                result = timestamp - moment(new Date()).unix();
                let sec = result % 60;
                const seconds = sec.toString().length < 2 ? '0'+sec.toString() : sec
                const min = (result - sec) / 60;
                const minutes = min.toString().length < 2 ? '0'+min.toString() : min
                this.setState({
                    timer: `00:${minutes}:${seconds}`
                });
                if (0 >= result) {
                    clearInterval(interval);
                    this.setState({
                        timestamp: 0,
                        allowGenerate: true
                    });
                }

            }, minVal);
        };

        let {timestamp} = this.state;
        let time, finishedTime;
        if (timestamp) {
            time = moment(new Date()).unix();
            finishedTime = timestamp;
            if (time < finishedTime) return intervalFunc(finishedTime);
        }
        time = moment(new Date());
        finishedTime = moment(time).add(1, 'hour').unix();
        this.setState({
            timestamp: finishedTime
        });
        intervalFunc(finishedTime);
    }

    generate() {
        // if (!this.state.allowGenerate) return false;
        this.countAnimate();
        this.runTimer();
        const rndNumber = rundomizer(1000000, 10000000);
        if (9000000 > rndNumber) {
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
        function rundomizer(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

    }

    async storeData() {
        try {
            // const {animated,...data} = this.state //pass into data all exept animated
            await AsyncStorage.setItem('State', JSON.stringify(this.state));
        } catch (error) {
            // Error when save
            console.error(error);
        }
    }

    async restoreData() {
        try {
            const value = await AsyncStorage.getItem('State');
            if (value) {
                return value;
            }
        } catch (error) {
            // Error when restore
            console.error(error);
        }
    }

    componentWillUpdate() {
        this.storeData()
            .then();
    }

    componentDidMount() {
        // console.log(this.state);
        // this.setState(() => {
        //     return {
        //         animated: new Animated.Value(0),
        //     };
        // });
        // console.log(this.state);
        // const {animated} = this.state
        // Animated.timing(
        //     animated,        
        //     {
        //       toValue: 1,              
        //       duration: 1000,
        //     }
        //   ).start();
    }

    componentWillMount() {
        this.restoreData()
            .then(JSON.parse)
            .then(doc => {
                this.setState(() => {
                    return {
                        ...doc
                    };
                });
                if (doc.timestamp) this.runTimer();
            })
    }

    countAnimate = () => {
            this.сountText.method()
      }

    render() {

        let {
            cash,
            balance,
            timer,
            animated,
            allowGenerate
        } = this.state;

        return (
            <View style={styles.container}>
                <Text style={[styles.title, getStyle(getRatio(), 'title', isIPad)]}>Ripple Generator</Text>
                <View style={{alignSelf: 'stretch', alignContent: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.subTitle, getStyle(getRatio(), 'subTitle', isIPad)]}>Balance:</Text>
                    <Text style={[styles.balance, getStyle(getRatio(), 'balance', isIPad)]}>{balance} XRP</Text>
                    <CountText onRef={ref => (this.сountText = ref)}>
                        <Text style={[styles.balanceCount, getStyle(getRatio(), 'balanceCount', isIPad)]}>
                        + 0.00002 XRP
                        </Text>
                    </CountText>
                </View>
                <View style={styles.container}>
                    <Image source={require("./src/Images/MainCard.png")}
                        style={[styles.MainCard, getStyle(getRatio(), 'MainCard', isIPad)]}/>
                    <Text style={[styles.generatedNumber, getStyle(getRatio(), 'generatedNumber', isIPad)]}>{cash}</Text>
                    <Text style={[styles.timer, getStyle(getRatio(), 'timer', isIPad)]}>{timer}</Text>

                    <TouchableOpacity
                        // disabled={!allowGenerate}
                        onPress={this.generate.bind(this)}
                        style={!allowGenerate?[styles.button,{backgroundColor:disabledBackground}, getStyle(getRatio(), 'button', isIPad)]:[styles.button, getStyle(getRatio(), 'button', isIPad)]}>
                        <Text style={!allowGenerate?[styles.buttonText,{color:disabledFont}, getStyle(getRatio(), 'buttonText', isIPad)]:[styles.buttonText, getStyle(getRatio(), 'buttonText', isIPad)]}>Generate</Text>
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
                        style={[styles.withdraw, getStyle(getRatio(), 'button', isIPad)]}>
                        <Text style={[styles.withdrawText, getStyle(getRatio(), 'buttonText', isIPad)]}>Withdraw</Text>
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
        fontSize: 22,
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
        fontSize: 22,
        backgroundColor: 'transparent'
    },
    balanceCount: {
        color: pink,
        right: 40,
        top: 55,
        width: width,
        textAlign: 'right',
        position: 'absolute',
        fontFamily: 'System',
        fontWeight: "normal",
        fontSize: 22,
        backgroundColor: 'transparent'
    },
    generatedNumber: {
        color: "#fff",
        fontSize: 42,
        fontWeight: '800',
        backgroundColor: 'transparent',
        marginBottom: 140
    },
    button: {
        backgroundColor: pink,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 255,
        height: 50,
        marginBottom: 30
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'System',
        fontWeight: "700",
        fontSize: 25,
        backgroundColor: 'transparent',
    },
    withdraw: {
        position: 'absolute',
        bottom: 30,
        borderBottomWidth: 3,
        borderColor: pink,
        paddingBottom: 7
    },
    withdrawText: {
        color: pink,
        fontSize: 22,
        fontFamily: 'System',
        fontWeight: '600',
        backgroundColor: 'transparent',
    },
    timer: {
        color: '#fff',
        marginBottom:180,
        fontFamily: 'System',
        fontWeight: "600",
        fontSize: 32,
        backgroundColor: 'transparent'
    },
    MainCard: {
        position: 'absolute',
        top: 50,
        resizeMode: 'stretch',
    },
    MainCardx3: {
        resizeMode: 'stretch'
    },
});
