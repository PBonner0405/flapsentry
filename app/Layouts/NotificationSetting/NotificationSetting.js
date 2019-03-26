'use strict';

import React from 'react';
import {Text, View, TouchableHighlight, StyleSheet, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class NotificationSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ComponentVisible: true,
            DeviceNumber: this.props.navigation.state.params.data.DeviceNumber,
            Notification1: '',
            Notification2: '',
            T_L1: this.props.navigation.state.params.data.T_L1,
            T_H1: this.props.navigation.state.params.data.T_H1,
            T_L2: this.props.navigation.state.params.data.T_L2,
            T_H2: this.props.navigation.state.params.data.T_H2,
            D_T: this.props.navigation.state.params.data.D_T,
            SSID: this.props.navigation.state.params.data.SSID,
        }
        // console.log(this.props.navigation.state.params);
    }

    onLaunch(){
        this.props.navigation.navigate("HomeView", {data: this.state});
    }

    render() {
        const {DeviceNumber, Notification1, Notification2} = this.state
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

                <Text style={styles.title}>Set Notification Message</Text>

                <TextInput
                    style={{height: 50, marginTop: 20, marginBottom: 10, paddingLeft: 5, paddingRight: 5, width: '90%', fontSize: 16, color: '#b39960', borderRadius:10, justifyContent: 'center'}}
                    onChangeText={(text) => this.setState({Notification1: text})}
                    value={Notification1}
                    tintColor={'green'}
                    placeholder="NOTIFICATION CONTENT FOR TEMPERATURE1"
                    placeholderTextColor='#b399605f'
                    underlineColorAndroid="#eee" 
                /> 
                <TextInput
                    style={{height: 50, marginTop: 10, marginBottom: 10, width: '90%', paddingLeft: 5, paddingRight: 5, fontSize: 16, color: '#26b893', borderRadius:10, justifyContent: 'center'}}
                    onChangeText={(text) => this.setState({Notification2: text})}
                    value={Notification2}
                    tintColor={'green'}
                    placeholder="NOTIFICATION CONTENT FOR TEMPERATURE2"
                    placeholderTextColor='#b399605f'
                    underlineColorAndroid="#eee" 
                /> 

                <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
                <TouchableHighlight
                    onPress={() => this.onLaunch()}
                    style={styles.btncontainer}>
                    <LinearGradient 
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={
                            styles.qrbutton
                        }
                    >
                        <Text style={{ alignContent: 'center',fontSize: 20, color: '#fff'}}> Launch Sentry </Text>
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
        width: '100%'
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
        paddingLeft: 30,
        paddingRight: 30,
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