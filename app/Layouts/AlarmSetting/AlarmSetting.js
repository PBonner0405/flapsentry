'use strict';

import React from 'react';
import {Text, View, TouchableHighlight, StyleSheet, TextInput} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class AlarmSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ComponentVisible: true,
            isOnNotication: false,
            DeviceNumber: '001',
            T_L1: '26',
            T_H1: '31',
            T_L2: '29',
            T_H2: '34',
            D_T: '3',
            SSID: this.props.navigation.state.params.data.SSID,
        }
        // console.log(this.props.navigation.state.params);
    }

    onNotificationSetting(){
        if(this.state.isOnNotication)
        {
            this.props.navigation.navigate("NotificationSetting", {data: this.state});
        }
        else{
            this.props.navigation.navigate("HomeView", {data: this.state});
        }
    }

    render() {
        const {ComponentVisible, isOnNotication, DeviceNumber, T_L1, T_H1, T_L2,T_H2, D_T} = this.state
        
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
                <Text style={styles.title}>DEVICE #{DeviceNumber}</Text>
                <Text style={styles.title}>Set Alarms</Text>
                    
                <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
                <View style={{width: '100%'}}>
                    <View style={{width: '100%', height: 40, flexDirection: 'row', marginTop: 15}}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={styles.textLabel}> T1 Low: </Text>
                            <TextInput
                                style={{height: 40, width: 60, fontSize: 18, color: '#eee', borderRadius:10, textAlign: "center"}}
                                onChangeText={(text) => this.setState({T_L1: text})}
                                value={T_L1}
                                tintColor={'green'}
                                underlineColorAndroid="#eee" 
                            /> 
                            <Text style={styles.textLabel}> °C </Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'center'}}>
                            <Text style={styles.textLabel}> High: </Text>
                            <TextInput
                                style={{height: 40, width: 60, fontSize: 18, color: '#eee', borderRadius:10, textAlign: "center"}}
                                onChangeText={(text) => this.setState({T_H1: text})}
                                value={T_H1}
                                tintColor={'green'}
                                underlineColorAndroid="#eee" 
                            />
                            <Text style={styles.textLabel}> °C </Text>
                        </View>
                    </View>
                    <View style={{width: '100%', height: 40, flexDirection: 'row', marginTop: 15}}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={styles.textLabel}> T2 Low: </Text>
                            <TextInput
                                style={{height: 40, width: 60, fontSize: 18, color: '#eee', borderRadius:10, textAlign: "center"}}
                                onChangeText={(text) => this.setState({T_L2: text})}
                                value={T_L2}
                                tintColor={'green'}
                                underlineColorAndroid="#eee" 
                            /> 
                            <Text style={styles.textLabel}> °C </Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'center'}}>
                            <Text style={styles.textLabel}> High: </Text>
                            <TextInput
                                style={{height: 40, width: 60, fontSize: 18, color: '#eee', borderRadius:10, textAlign: "center"}}
                                onChangeText={(text) => this.setState({T_H2: text})}
                                value={T_H2}
                                tintColor={'green'}
                                underlineColorAndroid="#eee"
                            />
                            <Text style={styles.textLabel}> °C </Text>
                        </View>
                    </View>
                    <View  style={{width: '100%', height: 40, flexDirection: 'row', marginTop: 15}}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={styles.textLabel}> ꭉT(T2-T1): {parseFloat(T_H2, 10)-parseFloat(T_H1, 10)} °C</Text>
                        </View>
                    </View>
                    
                    <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                        <ToggleSwitch
                            isOn={isOnNotication}
                            onColor='green'
                            offColor='blue'
                            label='Notification'
                            labelStyle={styles.title}
                            size='large'
                            onToggle={ (isOn) => this.setState({isOnNotication: isOn}) }
                            style={{alignContent: 'center', alignItems: 'center'}}
                        />
                    </View>
                </View>
                <TouchableHighlight
                    onPress={() => this.onNotificationSetting()}
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#4c669f',
    },
    btncontainer: {
        marginTop: 50,
        borderRadius:5,
        borderColor: '#fff'
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
        color: '#d0d0d4', 
        fontSize: 18, 
        alignSelf: 'center',
        alignContent: 'center'
    }
  });