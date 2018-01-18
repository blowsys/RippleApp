import React, { Component } from 'react';
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
import Expo, {
    AdMobInterstitial,
    AdMobRewarded
} from 'expo';

import {onBoarding , mainScreen} from './src/components/common';

Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);

const ADMOB = {
    ios: {
        AdMobInterstitial: 'ca-app-pub-6287272260079357/1283184368',
        AdMobRewarded: 'ca-app-pub-6287272260079357/6312241659'
    },
    android: {
        AdMobInterstitial: 'ca-app-pub-6287272260079357/1349868637',
        AdMobRewarded: 'ca-app-pub-6287272260079357/9499466175'
    },
    test: {
        AdMobRewarded: 'ca-app-pub-1425926517331745/3923257478',
        AdMobInterstitial: 'ca-app-pub-3940256099942544/1033173712'
    }
};

// Display a rewarded ad
AdMobRewarded.setAdUnitID(ADMOB.test.AdMobRewarded); // Test ID, Replace with your-admob-unit-id
AdMobRewarded.setTestDeviceID('EMULATOR');

// Display an interstitial
AdMobInterstitial.setAdUnitID(ADMOB.test.AdMobInterstitial); // Test ID, Replace with your-admob-unit-id
AdMobInterstitial.setTestDeviceID('EMULATOR');
AdMobInterstitial.requestAd((err) => {
    console.log(err);
    AdMobInterstitial.showAd();
});

const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;
const {width, height} = Dimensions.get('window');

//Style variables
const pink = '#ff4682';
const disabledBackground = '#EDEDED';
const disabledFont = '#aaa';


const getRatio = () => {
    return width == 1024 ? 5 : width == 414 ? 4 : width == 320 ? 1 : Math.round(PixelRatio.get());
};

const isIPad = (() => {
    if ('ios' !== Platform.OS) return false;

    if (width == 1024 || width < PAD_WIDTH) {
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

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cash: '00000',
            lastReplenishment: '0.00002',
            balance: 0,
            allowGenerate: true,
            timer: '00:00:00',
            timestamp: 0,
            startScreen:false,
        };
        this.opacity = new Animated.Value(0);
        this.transform = new Animated.ValueXY({x: 0, y: 0});
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
                const seconds = sec.toString().length < 2 ? '0' + sec.toString() : sec;
                const min = (result - sec) / 60;
                const minutes = min.toString().length < 2 ? '0' + min.toString() : min;
                this.setState({
                    timer: `00:${minutes}:${seconds}`
                });
                if (0 >= result) {
                    clearInterval(interval);
                    this.setState({
                        timestamp: 0,
                        allowGenerate: true,
                        timer: '00:00:00'
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
        finishedTime = moment(time).add(5, 'minutes').unix();
        this.setState({
            timestamp: finishedTime
        });
        intervalFunc(finishedTime);
    }

    allowGenerate() {
        this.setState({
            allowGenerate: true,
            timer: '00:00:00'
        });
    }

    generate() {
        // if (!this.state.allowGenerate) return;
        let replenishment1 = 0.00001;
        this.countAnimate();
        this.runTimer();
        const rndNumber = rundomizer(1000000, 10000000);
        if (5000000 > rndNumber) {
            AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd());
        } else {
            AdMobRewarded.requestAd(() => AdMobRewarded.showAd());
            AdMobRewarded.addEventListener('rewardedVideoDidRewardUser', (doc) => {
                console.log(doc);
                replenishment1 = 0.001;

                this.countAnimate();
                
                setTimeout(() => {
                    this.setState({
                        balance: (parseFloat(this.state.balance) + replenishment1).toFixed(5),
                    });
                }, 1000);
            });
        }
        this.setState({
            lastReplenishment: `${replenishment1}`
        });
        this.setState({
            cash: rndNumber
        });
        setTimeout(() => {
            this.setState({
                balance: (parseFloat(this.state.balance) + replenishment1).toFixed(5),
            });
        }, 1000);

        // Generate Random Number
        function rundomizer(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

    }

    async storeData() {
        try {
            const {opaicty, ...data} = this.state; //pass into data all exept animated
            await AsyncStorage.setItem('State', JSON.stringify(data));
        } catch (error) {
            // Error when save
            console.error(error);
        }
    }

    async restoreData() {
        try {
            const value = await AsyncStorage.getItem('State');
            if (value) {
                this.setState({ startScreen: false })
                return value;
            } else
                this.setState({ startScreen: true })
        } catch (error) {
            // Error when restore
            console.error(error);
        }
    }

    componentWillUpdate() {
        this.storeData()
            .then();
    }

    animate() {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(
                    this.opacity,
                    {
                        toValue: 1,
                        duration: 200
                    }),
                Animated.spring(
                    this.transform,
                    {
                        toValue: {x: 0, y: -25},
                        duration: 200,
                        bounciness: 10,
                    })
            ]),
            Animated.parallel([
                Animated.timing(
                    this.opacity,
                    {
                        toValue: 0,
                        duration: 200
                    }),
                Animated.spring(
                    this.transform,
                    {
                        toValue: {x: 0, y: -50},
                        duration: 150,
                    })
            ]),
            Animated.timing(
                this.transform,
                {
                    toValue: {x: 0, y: 0},
                    duration: 0,
                }),

        ]).start();
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
                const time = moment(new Date()).unix();
                doc.timestamp > time
                    ? this.runTimer()
                    : this.allowGenerate();
            });
    }

    countAnimate = () => {
        this.animate();
    }

    image = () => {
        if (isIPad || width == 1024) {
            return <Image source={require("./src/Images/MainCardPad.png")}
                          style={[styles.MainCard, getStyle(getRatio(), 'MainCard', isIPad)]}/>
        }
        if (!isIPad) {
            return <Image source={require("./src/Images/MainCard.png")}
                          style={[styles.MainCard, getStyle(getRatio(), 'MainCard', isIPad)]}/>
        }
    }

    render() {

        let {
            cash,
            balance,
            timer,
            animated,
            allowGenerate,
            lastReplenishment
        } = this.state;

        return (
            <View style={styles.container}>
                <Text style={[styles.title, getStyle(getRatio(), 'title', isIPad)]}>Ripple Generator</Text>
                <View style={{alignSelf: 'stretch', alignContent: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.subTitle, getStyle(getRatio(), 'subTitle', isIPad)]}>Balance:</Text>
                    <Text style={[styles.balance, getStyle(getRatio(), 'balance', isIPad)]}>{balance} XRP</Text>
                    <Animated.Text style={[styles.balanceCount, getStyle(getRatio(), 'balanceCount', isIPad), {
                        opacity: this.opacity,
                        transform: [
                            {
                                translateY: this.transform.y
                            }
                        ]
                    }]}>
                        + {lastReplenishment} XRP
                    </Animated.Text>
                </View>
                <View style={styles.container1}>
                    {this.image()}
                    <Text
                        style={[styles.generatedNumber, getStyle(getRatio(), 'generatedNumber', isIPad)]}>{cash}</Text>
                    <Text style={[styles.timer, getStyle(getRatio(), 'timer', isIPad)]}>{timer}</Text>

                    <TouchableOpacity
                        disabled={!allowGenerate}
                        onPress={this.generate.bind(this)}
                        style={!allowGenerate ? [styles.button, {backgroundColor: disabledBackground}, getStyle(getRatio(), 'button', isIPad)] : [styles.button, getStyle(getRatio(), 'button', isIPad)]}>
                        <Text
                            style={!allowGenerate ? [styles.buttonText, {color: disabledFont}, getStyle(getRatio(), 'buttonText', isIPad)] : [styles.buttonText, getStyle(getRatio(), 'buttonText', isIPad)]}>Generate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Withdraw your cash',
                                `You have ${balance} XRP but for withdraw you need 1.0000000 XRP`,
                                [
                                    {text: 'Cancel', onPress: () => {
                                        AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd());
                                        console.log('Cancel Button Pressed')}
                                        , style: 'cancel'
                                    },
                                    {text: 'OK', onPress: () => {
                                        AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd());
                                        console.log('OK ButtonPressed');
                                    }},
                                ]
                            );
                        }}
                        style={[styles.withdraw, getStyle(getRatio(), 'withdraw', isIPad)]}>
                        <Text
                            style={[styles.withdrawText, getStyle(getRatio(), 'withdrawText', isIPad)]}>Withdraw</Text>
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
    container1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
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
    titlex2: {
        paddingTop: 20,
    },
    titlex1: {
        paddingTop: 25,
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
    subTitlex1: {
        fontSize: 18
    },
    subTitlex5: {
        top: 15,
        fontSize: 24
    },
    subTitlePad: {
        top: 15,
        fontSize: 24
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
    balancex1: {
        fontSize: 18
    },
    balancex5: {
        top: 15,
        fontSize: 24
    },
    balancePad: {
        top: 15,
        fontSize: 24
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
    balanceCountx2: {
        top: 52,
    },
    balanceCountx1: {
        fontSize: 18,
        top: 52,
    },
    balanceCountx5: {
        top: 65,
        fontSize: 24,
    },
    balanceCountPad: {
        top: 65,
        fontSize: 24,
    },
    generatedNumber: {
        color: "#fff",
        fontSize: 42,
        fontWeight: '800',
        backgroundColor: 'transparent',
        marginTop: 140
    },
    generatedNumberPad: {
        marginTop: 160
    },
    generatedNumberx5: {
        marginTop: 260
    },
    generatedNumberx2: {
        marginTop: 120
    },
    generatedNumberx1: {
        marginTop: 100
    },
    timer: {
        color: '#fff',
        marginTop: 130,
        marginBottom: 170,
        fontFamily: 'System',
        fontWeight: "600",
        fontSize: 32,
        backgroundColor: 'transparent'
    },
    timerx5: {
        marginTop: 250,
        marginBottom: 325,
        fontSize: 38,
    },
    timerPad: {
        marginTop: 240,
        marginBottom: 240,
        fontSize: 38,
    },
    timerx4: {
        marginTop: 130,
        marginBottom: 130,
    },
    timerx2: {
        marginTop: 130,
        marginBottom: 120,
    },
    timerx1: {
        marginTop: 100,
        marginBottom: 100,
    },
    button: {
        backgroundColor: pink,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9,
        width: 255,
        height: 50,
    },
    buttonPad: {
        width: 350,
        height: 60
    },
    buttonx5: {
        width: 350,
        height: 75,
        borderRadius: 10
    },
    buttonx1: {
        width: 220,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'System',
        fontWeight: "700",
        fontSize: 25,
        backgroundColor: 'transparent',
    },
    buttonTextx5: {
        fontSize: 28
    },
    buttonTextPad: {
        fontSize: 28
    },
    withdraw: {
        position: 'absolute',
        bottom: 30,
        borderBottomWidth: 3,
        borderColor: pink,
        paddingBottom: 7
    },
    withdrawx4: {
        borderColor: '#fff',
        bottom: 55,
        borderBottomWidth: 2,
        paddingBottom: 5
    },
    withdrawx2: {
        borderColor: '#fff',
        bottom: 55,
        borderBottomWidth: 2,
        paddingBottom: 5
    },
    withdrawx1: {
        borderColor: '#fff',
        bottom: 15,
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    withdrawText: {
        color: pink,
        fontSize: 22,
        fontFamily: 'System',
        fontWeight: '600',
        backgroundColor: 'transparent',
    },
    withdrawTextx4: {
        color: '#fff',
        fontSize: 20,
    },
    withdrawTextx2: {
        color: '#fff',
        fontSize: 20,
    },
    withdrawTextx1: {
        color: '#fff',
        fontSize: 20,
    },
    MainCard: {
        position: 'absolute',
        top: 50,
        resizeMode: 'contain',
    },
    MainCardPad: {
        width: width - 250,
        top: -125
    },
    MainCardx5: {
        width: width - 400,
        top: 25
    },
    MainCardx4: {
        width: width - 15,
        resizeMode: 'contain',
    },
    MainCardx2: {
        width: width - 15,
        top: 35,
    },
    MainCardx1: {
        width: width,
        top: 0,
    },
});