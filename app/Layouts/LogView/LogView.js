'use strict';

import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight, Platform, TouchableOpacity, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
var SQLite = require('react-native-sqlite-storage');
import { openDatabase } from 'react-native-sqlite-storage';

var db;

if (Platform.OS === 'ios') {
    db = SQLite.openDatabase({name: 'loginfo.db', createFromLocation: 1}, (open) => {}, (e) => {console.log("error opening db:", e)});
}
else {
    db = openDatabase({name: 'loginfo.db', createFromLocation: '~loginfo.sqlite3', location: 'Library'}, (open) => {console.log("opened???", open)}, (e) => {console.log("something went wrong while opening db:", e)});
}

export default class LogView extends React.Component {

    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            ComponentVisible: true,
            sever_flag: false,
            data: [],
            title: {No: "No", SSID: "SSID", T1: "T1", T2: "T2", T3: "T3", Created: "Created"},
            esp_ssid: this.props.navigation.state.params.data.esp_ssid,
            showing_flag: false,
        }
        
    }

    componentDidMount() {
        this._isMounted = true;
        db.transaction((tx) => {
            tx.executeSql(
                // 'SELECT * FROM `logtable` WHERE "esp_ssid"=' + '"' + this.state.esp_ssid + '"'
                'SELECT * FROM `logtable` WHERE "esp_ssid"=' + '"' + this.state.esp_ssid + '" ORDER BY id DESC LIMIT 1440'
                ,[]
                ,(tx, res) => {
                    console.log("Load Data Succed::", res, res.rows.length, res.rows.item(0));
                    if (this._isMounted) {
                        let details = [];

                        for(var i = 0; i < res.rows.length; i ++){
                            let dt = res.rows.item(i);
                            var tmp = {
                                No: i.toString(),
                                SSID: dt.esp_ssid,
                                T1: dt.t1,
                                T2: dt.t2,
                                T3: dt.t3,
                                Created: dt.month + "/" + dt.day + " " + dt.hour + ":" + dt.min
                            }
                            details.push(tmp);
                        }

                        this.setState({
                            data: details
                        });
                        console.log(this.state.data);
                        
                        this.setState({
                            sever_flag: false,
                            showing_flag: true,
                        });
                    }else {
                        console.log("you are trying to set state after component unmounted... Knight")
                    }
                    console.log("my state.data length:", this.state.data.length);
                }
                ,(tx,err) => console.log("what is wrong?", tx, err)
            )
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    loadFromSever(){
        this.setState({
            showing_flag: false,
        });
        //http://13.229.126.58/api/gethistory.php?ssid=24AC48F348&time=120
        var request = new XMLHttpRequest();
            var req_url = "http://13.229.126.58/api/gethistory.php?ssid=" + this.state.esp_ssid + "&time=120";
            request.onreadystatechange = (e) => {
                if (request.readyState !== 4) {
                    return;
                }
    
                if (request.status === 200) {
                    var response = JSON.parse(request.responseText);
                    console.log("response from Sever:", response);
                    if (this._isMounted) {
                        let details = [];

                        for(var i = 0; i < response.length; i ++){
                            let dt = response[i];
                            var tmp = {
                                No: i.toString(),
                                SSID: dt.ssid,
                                T1: dt.fsr01,
                                T2: dt.fsr02,
                                T3: dt.fsr03,
                                Created: dt.created_at.substring(5,16)
                            }
                            details.push(tmp);
                        }

                        this.setState({
                            data: details
                        });
                        console.log(this.state.data);
                        
                        this.setState({
                            sever_flag: true,
                            showing_flag: true,
                        });
                    }else {
                        console.log("you are trying to set state after component unmounted... Knight")
                    }
                } else {
                    console.log('error');
                }
            };
    
            request.open('GET', req_url);
            request.send();
    }

    loadFromLocal(){
        this.setState({
            sever_flag: false,
            showing_flag: false,
        })
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM `logtable` WHERE "esp_ssid"=' + '"' + this.state.esp_ssid + '" ORDER BY id DESC LIMIT 1440'
                ,[]
                ,(tx, res) => {
                    console.log("Load Data Succed::", res, res.rows.length, res.rows.item(0));
                    if (this._isMounted) {
                        let details = [];

                        for(var i = 0; i < res.rows.length; i ++){
                            let dt = res.rows.item(i);
                            var tmp = {
                                No: i.toString(),
                                SSID: dt.esp_ssid,
                                T1: dt.t1,
                                T2: dt.t2,
                                T3: dt.t3,
                                Created: dt.month + "/" + dt.day + " " + dt.hour + ":" + dt.min
                            }
                            details.push(tmp);
                        }
                        this.setState({
                            data: details
                        });

                        this.setState({
                            sever_flag: false,
                            showing_flag: true,
                        });
                    }else {
                        console.log("you are trying to set state after component unmounted... Knight")
                    }
                    // for(var i = 0; i < res.rows.length; i ++){
                    //     let dt = res.rows.item(i);
                    //     var tmp = {
                    //         No: i.toString(),
                    //         SSID: dt.esp_ssid,
                    //         T1: dt.t1,
                    //         T2: dt.t2,
                    //         T3: dt.t3,
                    //         Created: dt.month + "/" + dt.day + " " + dt.hour + ":" + dt.min
                    //     }
                    //     this.state.data.push(tmp);
                        // this.setState({
                        //     data: this.state.data.push(tmp)
                        // });
                    // }
                }
                ,(tx,err) => console.log("what is wrong?", tx, err)
            )
        });
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
                <View style={styles.selectionContainer}>
                    <TouchableHighlight
                        onPress={() => this.loadFromSever()}
                        style={styles.btncontainer}>
                        <LinearGradient 
                            colors={['#4c669f', '#3b5998', '#192f6a']}
                            style={
                                styles.qrbutton
                            }
                        >
                            <Text style={{ alignContent: 'center',fontSize: 18, color: '#fff', textAlign: "center"}}> Load Sever Log </Text>
                        </LinearGradient>          
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={() => this.loadFromLocal()}
                        style={styles.btncontainer}>
                        <LinearGradient 
                            colors={['#4c669f', '#3b5998', '#192f6a']}
                            style={
                                styles.qrbutton
                            }
                        >
                            <Text style={{ alignContent: 'center',fontSize: 18, color: '#fff', textAlign: "center"}}> Load Local Log </Text>
                        </LinearGradient>          
                    </TouchableHighlight>
                </View>
                
                <ScrollView style={styles.logView}>
                    <TouchableOpacity 
                        key={this.state.title.No}
                        style={styles.row}
                        onPress = {() => console.log("Title...")}>
                        <Text style={{flex: 1,color: "#fff", justifyContent:"center", alignItems:"center"}}>
                            {this.state.title.No}
                        </Text>
                        <Text style={styles.row_item}>
                            {this.state.title.SSID}
                        </Text>
                        <Text style={styles.row_item}>
                            {this.state.title.T1}
                        </Text>
                        <Text style={styles.row_item}>
                            {this.state.title.T2}
                        </Text>
                        <Text style={styles.row_item}>
                            {this.state.title.T3}
                        </Text>
                        <Text style={styles.row_item}>
                            {this.state.title.Created}
                        </Text>
                    </TouchableOpacity >
                    {
                        this.state.showing_flag&&this.state.data.map((item, index) => (
                            <TouchableOpacity 
                                key={item.No}
                                style={styles.row}
                                onPress = {() => console.log("hmm...")}>
                                <Text style={{flex: 1,color: "#fff", justifyContent:"center", alignItems:"center"}}>
                                    {index}
                                </Text>
                                <Text style={styles.row_item}>
                                    {item.SSID}
                                </Text>
                                <Text style={styles.row_item}>
                                    {item.T1}
                                </Text>
                                <Text style={styles.row_item}>
                                    {item.T2}
                                </Text>
                                <Text style={styles.row_item}>
                                    {item.T3}
                                </Text>
                                <Text style={styles.row_item}>
                                    {item.Created}
                                </Text>
                            </TouchableOpacity >
                        ))
                    }
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:'#4c669f',
    },
    selectionContainer: {
        width: "100%",
        height: 50,
        top: 10,
        backgroundColor: "#ffffff00",
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btncontainer: {
        borderRadius:5,
        borderColor: '#fff'
    },
    qrbutton: {
        width: 150,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius:5,
        marginRight: 5,
        marginLeft: 5,
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
    },
    logView :{
        width: "100%",
        position: "relative",
        top: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    row_item: {
        flex:2,
        color: "#fff",
        justifyContent: "center",
    },
    row: {
        width: "100%",
        height: 50,
        flexDirection: "row",
    }
  });