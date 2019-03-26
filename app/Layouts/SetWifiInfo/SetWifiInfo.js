'use strict';

import React from 'react';
import {Text, View, TouchableHighlight, StyleSheet, TextInput, ActivityIndicator, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WifiManager from 'react-native-wifi';
import {PermissionsAndroid} from 'react-native';
import wifi from 'react-native-android-wifi';
import Toast from 'react-native-root-toast';

export default class SetWifiInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ComponentVisible: true,
            esp_device: '',
            wifi_id: 'TP-LINK_133',
            wifi_pwd: 'flx2809133',
            SSID: this.props.navigation.state.params.SSID,
            isLoading: true
        }
        // var tmp = JSON.stringify(this.props.navigation.state.params.url);
        // if(tmp.length > 6){
        //     this.state.esp_device = tmp.substring(3, tmp.length-3);
        // }

        console.log("scanned ssid:", this.state.SSID);

        this.init("EYE-DROP-AP", "");
    }

    init(w_id, w_pwd){
        if(Platform.OS === 'android'){
            async function requestInternetPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Fine Location Permission',
                            message:
                            'Do you allow your app access to network?',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('You can access to Network');
                        wifi.disconnect();
                        wifi.isEnabled((isEnabled) => {
                            if (isEnabled) {
                                console.log("wifi service enabled");
                            } else {
                                console.log("wifi service is disabled");
                            }
                        });
                        wifi.setEnabled(true);
                        wifi.loadWifiList(
                            (wifiStringList) => {
                                var wifiArray = JSON.parse(wifiStringList);
                                console.log(wifiArray);
                            },
                            (error) => {
                                console.log(error);
                            }
                        );
                        //found returns true if ssid is in the range
                        wifi.findAndConnect(w_id, w_pwd, (found) => {
                            if (found) {
                                console.log("wifi is in range");
                                return true;
                            } else {
                                console.log("wifi is not in range");
                                return false;
                            }
                        });
                        return true;
                    } else {
                        console.log('Fine location permission denied');
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
            requestInternetPermission().then((res)=>{
                if(res){
                    console.log("what is the return value?::", "true");
                }else {
                    console.log("what is the return value?::", "false");
                }
                
                wifi.getSSID((ssid) => {
                    console.log(ssid);
                });

                wifi.getIP((ip) => {
                    console.log(ip);
                });

                this.setState({isLoading: false})
            });
        }else {
            //wifi connection WifiManager.connectToProtectedSSID("ssid", "password", false)
            WifiManager.connectToProtectedSSID(w_id, w_pwd, false).then(
                () => {
                    this.setState({
                        isLoading: false,
                    });
                    console.log('Connected successfully!')
                }, () => {
                    this.setState({
                        isLoading: false,
                    });
                    console.log('Connection failed!')
                    alert("try to scan correct device qr code!")
                    this.props.navigation.navigate("ScanQRCode");
                }
            )
            
            WifiManager.getCurrentWifiSSID().then(
                (ssid) => {
                    console.log("Your current connected wifi SSID is " + ssid)
                }, () => {
                    console.log('Cannot get current SSID!')
                }
            )
        }
    }    
    
    setESPConnection(){
        //server url: http;//192.168.4.1/wifisave?s=TP_LINK-133&p=flx2809133
        var req_url = "http://192.168.4.1/wifisave?s=";
        req_url = req_url + this.state.wifi_id + '&p=';
        req_url = req_url + this.state.wifi_pwd;

        this.setState({
            isLoading: true,
        });

        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }

            console.log("http request return status:", request.responseText);
            if (request.status === 200) {
                this.setState({
                    isLoading: false,
                })
                console.log('response::', request.responseText);
                
                if(request.responseText.includes("success")){
                    this.init(this.state.wifi_id, this.state.wifi_pwd);
                    this.props.navigation.navigate("AlarmSetting", {data: this.state});
                }
                else{
                    let toast = Toast.show('Try again. Incorrect id or password', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                        onShow: () => {
                            // calls on toast\`s appear animation start
                        },
                        onShown: () => {
                            // calls on toast\`s appear animation end.
                        },
                        onHide: () => {
                            // calls on toast\`s hide animation start.
                        },
                        onHidden: () => {
                            // calls on toast\`s hide animation end.
                        }
                    });
                    this.init("EYE-DROP-AP", "");
                }
            } else {
                console.log('error');
                this.init("EYE-DROP-AP", "");
                setTimeout(() => {console.log("resend request...")},2000);
                
                var request_1 = new XMLHttpRequest();
                request_1.onreadystatechange = (e) => {
                    if (request_1.readyState !== 4) {
                        return;
                    }

                    console.log("http request_1 return status:", request_1.responseText);
                    if (request_1.status === 200) {
                        this.setState({
                            isLoading: false,
                        })
                        console.log('response_1::', request.responseText);
                        
                        if(request.responseText.includes("success")){
                            this.init(this.state.wifi_id, this.state.wifi_pwd);
                            this.props.navigation.navigate("AlarmSetting", {data: this.state});
                        }
                        else{
                            let toast = Toast.show('Try again. Incorrect id or password', {
                                duration: Toast.durations.LONG,
                                position: Toast.positions.BOTTOM,
                                shadow: true,
                                animation: true,
                                hideOnPress: true,
                                delay: 0,
                                onShow: () => {
                                    // calls on toast\`s appear animation start
                                },
                                onShown: () => {
                                    // calls on toast\`s appear animation end.
                                },
                                onHide: () => {
                                    // calls on toast\`s hide animation start.
                                },
                                onHidden: () => {
                                    // calls on toast\`s hide animation end.
                                }
                            });
                            this.init("EYE-DROP-AP", "");
                        }
                    } else {
                        this.setState({
                            isLoading: false,
                        })
                        console.log('error');
                        this.init("EYE-DROP-AP", "");
                        
                        let toast = Toast.show('Try again. There was an connection Error...', {
                            duration: Toast.durations.LONG,
                            position: Toast.positions.BOTTOM,
                            shadow: true,
                            animation: true,
                            hideOnPress: true,
                            delay: 0,
                            onShow: () => {
                                // calls on toast\`s appear animation start
                            },
                            onShown: () => {
                                // calls on toast\`s appear animation end.
                            },
                            onHide: () => {
                                // calls on toast\`s hide animation start.
                            },
                            onHidden: () => {
                                // calls on toast\`s hide animation end.
                            }
                        });
                    }
                };

                request_1.open('GET', req_url);
                console.log(req_url);
                request_1.send();
            }
        };

        request.open('GET', req_url);
        console.log(req_url);
        request.send();
    }

    render() {

        return (
            <View style={styles.container}>
                <LinearGradient 
                    start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                    colors={['#000000bf', '#0000006f']}
                    locations={[0, 0.9]}
                    style={
                        {
                            position: "absolute",
                            width: '100%',
                            height: '100%'
                        }
                    }
                />

                {
                    this.state.isLoading && 
                    <LinearGradient 
                        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                        colors={['#000000', '#000030']}
                        locations={[0, 0.9]}
                        style={
                            {
                                position: "absolute",
                                width: '100%',
                                height: '100%',
                                zIndex: 99
                            }
                        }
                    />&& <ActivityIndicator size="large" color="#bc2b78" style={styles.activityIndicator} /> 
                }
                
                <View style={{width: "90%", height: 150, flexDirection: 'column'}}>
                    <View style={styles.rowcontainer}>
                        {/* <Text style={styles.textLabel}> Input ID: </Text> */}
                        <TextInput 
                            placeholder = "Enter Wi-Fi ID" 
                            onChangeText={(text) => this.setState({wifi_id: text})}
                            value={this.state.wifi_id}
                            style={styles.inputStyle}
                            placeholderTextColor='#b399605f'
                            underlineColorAndroid='#eee'
                        />
                        {/* <TextInput
                            style={styles.inputStyle}
                            onChangeText={(text) => this.setState({wifi_id: text})}
                            value={this.state.wifi_id}
                            tintColor={'green'}
                            underlineColorAndroid="#eee" 
                        />  */}
                    </View>
                    <View style={styles.rowcontainer}>
                        {/* <Text style={styles.textLabel}> Password: </Text>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(text) => this.setState({wifi_pwd: text})}
                            value={this.state.wifi_pwd}
                            tintColor={'green'}
                            underlineColorAndroid="#eee"
                        /> */}
                        <TextInput 
                            placeholder = "Enter Wi-Fi Password" 
                            onChangeText={(text) => this.setState({wifi_pwd: text})}
                            value={this.state.wifi_pwd}
                            style={styles.inputStyle}
                            tintColor={'green'}
                            placeholderTextColor='#b399605f'
                            underlineColorAndroid='#eee'
                        />
                    </View>
                </View>
                <TouchableHighlight
                    onPress={() => this.setESPConnection()}
                    style={styles.btncontainer}>
                    <LinearGradient 
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={
                            styles.qrbutton
                        }
                    >
                        <Text style={{ alignContent: 'center',fontSize: 20, color: '#fff'}}> Next </Text>
                    </LinearGradient>
                                    
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#4c669f',
    },
    btncontainer: {
        marginTop: 50,
        borderRadius:5,
        borderColor: '#fff'
    },
    rowcontainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    qrbutton: {
        width: 200,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft: 70,
        paddingRight: 70,
        borderRadius:5,
        borderColor: '#ddd',
        alignContent: 'center',
        fontSize: 22
    },
    heading: { 
        color: '#d0d0d4', 
        fontSize: 32, 
        alignSelf: 'center', 
        padding: 5,
        marginBottom: 10
    },
    title: {
        fontSize: 22, 
        alignSelf: 'center',
        padding: 5,
        alignItems: 'center',
        color: '#d0d0d4'
    },
    textLabel: {
        flex: 1,
        color: '#d0d0d4', 
        fontSize: 18,
        textAlignVertical: 'center'
    },

    inputStyle: {
        flex: 2,
        fontSize: 18,
        color: '#eee',
        borderRadius:10,
        textAlign: "center"
    },

    activityIndicator: {
        position: 'absolute',
        top: 200,
        alignContent: 'center',
        width: 100,
        height: 100,
    }
  });