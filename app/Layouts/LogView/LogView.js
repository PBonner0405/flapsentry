'use strict';

import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight, Platform} from 'react-native';
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

    constructor(props) {
        super(props);
        this.state = {
            ComponentVisible: true,
            sever_flag: false,
            data: [{No: "No", SSID: "SSID", T1: "T1", T2: "T2", T3: "T3", Created: "Created"}],
            esp_ssid: this.props.navigation.state.params.data.esp_ssid,
        }
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM `logtable` WHERE esp_ssid=' + this.state.esp_ssid
                ,[]
                ,(tx, res) => {
                    console.log("Query completed",tx, res);
                }
                ,(tx,err) => console.log("what is wrong?", tx, err)
            )
        });
    }

    loadFromSever(){
        this.setState({
            sever_flag: true
        })
    }

    loadFromLocal(){
        this.setState({
            sever_flag: false
        })
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
                
                <View style={styles.logView}>
                    {
                        this.state.data.map((item, index) => (
                        <TouchableHighlight
                            key={item.No}
                            style={styles.row}
                            onPress = {() => console.log("hmm...")}>
                            <Text style={styles.row_item}>
                                {item.No}
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
                        </TouchableHighlight>
                        ))
                    }
                </View>

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
    selectionContainer: {
        width: "100%",
        height: 100,
        backgroundColor: "#ffffff00",
        flexDirection: 'row',
    },
    btcontainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30
    },
    btncontainer: {
        marginTop: 25,
        borderRadius:5,
        borderColor: '#fff'
    },
    qrbutton: {
        width: 150,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius:5,
        marginRight: 20,
        marginLeft: 20,
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
        position: "relative",
        width: "100%",
        top: 200,
    },
    row_item: {
        flex:1,
        color: "#fff",
    },
    row: {
        flex: 1,
        flexDirection: "row",
    }
  });