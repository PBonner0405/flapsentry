'use strict';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createAppContainer } from 'react-navigation';

import StackNavigator from './app/StackNavigator';

const instructions = Platform.select({
  ios: 'Sentry Flap App for iOS version',
  android:
    'Sentry Flap App for Android version',
});

const App = createAppContainer(StackNavigator);

export default App;
