import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ScanQRCode from './Layouts/ScanQRCode/ScanQRCode';
import AlarmSetting from './Layouts/AlarmSetting/AlarmSetting';
import NotificationSetting from './Layouts/NotificationSetting/NotificationSetting';
import HomeView from './Layouts/HomeView/HomeView';
import LogView from './Layouts/LogView/LogView';
import SetWifiInfo from './Layouts/SetWifiInfo/SetWifiInfo';

const StackNavigator = createStackNavigator(
    {
        ScanQRCode: {
            screen: ScanQRCode,
            navigationOptions: {
                header: null,
            }
        },
        SetWifiInfo: {
            screen: SetWifiInfo,
            navigationOptions: {
                header: null,
            }
        },
        AlarmSetting: {
            screen: AlarmSetting,
            navigationOptions: {
                header: null,
            }
        },
        NotificationSetting: {
            screen: NotificationSetting,
            navigationOptions: {
                header: null,
            }
        },
        HomeView: {
            screen: HomeView,
            navigationOptions: {
                header: null,
            }
        },
        LogView: {
            screen: LogView,
            navigationOptions: {
                header: null,
            }
        },
    }
);

export default StackNavigator;