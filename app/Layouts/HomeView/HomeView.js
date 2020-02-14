'use strict';

import React from 'react';
import {Text, View, TouchableHighlight,StyleSheet,Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PushNotificationIOS from 'react-native';
import PubNubReact from 'pubnub-react';

var SQLite = require('react-native-sqlite-storage');
import { openDatabase } from 'react-native-sqlite-storage';
var db;
if (Platform.OS === 'ios') {
    db = SQLite.openDatabase({name: 'loginfo.db', createFromLocation: 1}, (open) => {}, (e) => {console.log("error opening db:", e)});
}
else {
    db = openDatabase({name: 'loginfo.db', createFromLocation: '~loginfo.sqlite3', location: 'Library'}, (open) => {console.log("opened???", open)}, (e) => {console.log("something went wrong while opening db:", e)});
}

var PushNotification = require('react-native-push-notification');

/*
CREATE TABLE `log_table` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`esp_ssid`	TEXT,
	`t1`	TEXT,
	`t2`	TEXT,
	`t3`	TEXT,
	`month`	INTEGER,
	`day`	INTEGER,
	`hour`	TEXT,
	`min`	INTEGER
);
*/
export default class HomeView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ComponentVisible: true,
            D_T: this.props.navigation.state.params.data.D_T,
            DeviceNumber: "001",
            DeviceNumber: this.props.navigation.state.params.data.DeviceNumber,
            T_H1: this.props.navigation.state.params.data.T_H1,
            T_H2: this.props.navigation.state.params.data.T_H2,
            T_L1: this.props.navigation.state.params.data.T_L1,
            T_L2: this.props.navigation.state.params.data.T_L2,
            isOnNotication: this.props.navigation.state.params.data.isOnNotication,
            notification_1: "",
            notification_2: "",
            esp_ssid: this.props.navigation.state.params.data.SSID,
            T1: "28.1",
            T2: "29.2",
            T3: "27.5",
            DB_FLAG: true,
        };
        console.log("state:", this.state);

        if(this.state.isOnNotication){
            console.log("notification on...");
            this.state.notification_1 = this.props.navigation.state.params.data.Notification1;
            this.state.notification_2 = this.props.navigation.state.params.data.Notification2;
            
            //Notification Settings...
            this.pubnub = new PubNubReact({
                publishKey: 'pub-c-7a2e02d2-0835-4d3b-a56e-adc681e7feef',
                subscribeKey: 'sub-c-5ddc4f8e-4571-11e9-82b8-5ab7e7fd9be2'
            });
            this.pubnub.init(this);
            PushNotification.configure({
                // Called when Token is generated.
                onRegister: function(token) {
                    console.log( 'TOKEN:', token );
                    alert('Token:'+token);
                    if (token.os == "ios") {
                        this.pubnub.push.addChannels(
                            {
                                channels: ['notifications'],
                                device: token.token,
                                pushGateway: 'apns'
                            }
                        );
                        // Send iOS Notification from debug console: {"pn_apns":{"aps":{"alert":"Hello World."}}}
                    } else if (token.os == "android"){
                        this.pubnub.push.addChannels(
                            {
                                channels: ['notifications'],
                                device: token.token,
                                pushGateway: 'gcm' // apns, gcm, mpns
                            }
                        );
                    // Send Android Notification from debug console: {"gcm":{"data":{"message":"Hello World."}}}
                    }  
                }.bind(this),
                // Something not working?
                // See: https://support.pubnub.com/support/solutions/articles/14000043605-how-can-i-troubleshoot-my-push-notification-issues-
                // Called when a remote or local notification is opened or received.
                onNotification: function(notification) {
                    console.log( 'NOTIFICATION:', notification );
                    // Do something with the notification.
                    // Required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
                    // notification.finish(PushNotificationIOS.FetchResult.NoData);
                },
                // ANDROID: GCM or FCM Sender ID
                senderID: "1070659258159",
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true
                },
                popInitialNotification: true,
                requestPermissions: true,
            });

            PushNotification.localNotificationSchedule({
                //... You can use all the options from localNotifications
                message: this.state.notification_1, // (required)
                date: new Date(Date.now() + (60 * 1000)), // in 60 secs
                vibrate: true, // (optional) default: true
                vibration: 500, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                title: "Warning...", // (optional)
            });
            //........................
        }

        var cnt = 0;
        setInterval(()=>{
            cnt ++;
            var request = new XMLHttpRequest();
            var req_url = "http://13.229.126.58/api/getCurrentStatus.php?ssid=" + this.state.esp_ssid; //"EYE-DROP-AP";//this.state.esp_ssid;
            request.onreadystatechange = (e) => {
                if (request.readyState !== 4) {
                    return;
                }
    
                if (request.status === 200) {
                    //response:: {"id":"345","ssid":"EYE-DROP-AP","fsr01":"-273.15","fsr02":"-273.15","fsr03":"23.18","created_at":"2019-03-23 03:27:53"}
                    var response = JSON.parse(request.responseText);
                    this.setState({
                        T1: response.fsr01,
                        T2: response.fsr02,
                        T3: response.fsr03,
                    });
                    if(cnt >= 49){
                        cnt = 0;
                        if(this.state.DB_FLAG){
                            // console.log("db flag is true..");
                            var month = response.created_at.substring(5,7);
                            var day = response.created_at.substring(8,10);
                            var hour = response.created_at.substring(11,13);
                            var min = response.created_at.substring(14,16);
                            db.transaction((tx) => {
                                tx.executeSql(
                                    'INSERT INTO logtable (esp_ssid, t1, t2, t3, month, day, hour, min) VALUES (?,?,?,?,?,?,?,?)'
                                    ,[this.state.esp_ssid, this.state.T1, this.state.T2, this.state.T3, month, day, hour, min]
                                    ,(tx, res) => {
                                        // console.log("Query completed",tx, res);
                                    }
                                    ,(tx,err) => console.log("what is wrong?", tx, err)
                                )
                            });
                        }
                    }                    
                } else {
                    console.log('error');
                }
            };
    
            request.open('GET', req_url);
            request.send();
        }, 1200);
    }
    
    onSettings(){
        this.props.navigation.navigate("AlarmSetting");
    }

    onTrend(){
        this.props.navigation.navigate("LogView", {data: this.state});
    }

    onLogout(){
        this.props.navigation.navigate("ScanQRCode");
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
                            flex:1, 
                            position: "absolute",
                            width: '100%', 
                            height: '100%'
                        }
                    }
                />
                <Text style={styles.heading}>FLAP SENTRY</Text>

                <View style={styles.btcontainer}>
                    <View style={{flex:1, justifyContent: 'center', flexDirection: 'column'}}>
                        <Text style={styles.title}>T1 (Flap)</Text>
                        <Text style={styles.title}>{this.state.T1}</Text>
                    </View>
                    <View style={{flex:1, justifyContent: 'center', flexDirection: 'column'}}>
                        <Text style={styles.title}>T2 (Flap)</Text>
                        <Text style={styles.title}>{this.state.T2}</Text>
                    </View>
                </View>
                <Text style={styles.title}>T3 (Ambient): {this.state.T3}</Text>
                <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
                <TouchableHighlight
                    onPress={() => this.onSettings()}
                    style={styles.btncontainer}>
                     <LinearGradient 
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={
                            styles.qrbutton
                        }
                    >
                        <Text style={{ alignContent: 'center',fontSize: 20, color: '#fff', textAlign: "center"}}> Settings </Text>
                    </LinearGradient>          
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={() => this.onTrend()}
                    style={styles.btncontainer}>
                     <LinearGradient 
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={
                            styles.qrbutton
                        }
                    >
                        <Text style={{ alignContent: 'center',fontSize: 20, color: '#fff', textAlign: "center"}}> Trend </Text>
                    </LinearGradient>           
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={() => this.onLogout()}
                    style={styles.btncontainer}>
                     <LinearGradient 
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={
                            styles.qrbutton
                        }
                    >
                        <Text style={{ alignContent: 'center',fontSize: 20, color: '#fff', textAlign: "center"}}> Logout </Text>
                    </LinearGradient>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#4c669f',
    },
    btcontainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30
    },
    btncontainer: {
        marginTop: 15,
        borderRadius:5,
        borderColor: '#fff'
    },
    qrbutton: {
        width: 200,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius:5,
        borderColor: '#ddd',
        alignContent: 'center',
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
        color: '#d0d0d4', 
        fontSize: 18, 
        alignSelf: 'center',
        alignContent: 'center'
    }
  });