import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {ListViewComponent, StyleSheet, Text, View} from 'react-native';

import {Header} from './components/Header';
import {MainContent} from './components/MainContent';
import {Bottom} from './components/Bottom';

export default function App() {
    return (
        <View style={styles.container}>
            <Header style={styles.header}/>
            <View style={styles.content}>
                <Text>MainContent</Text>
            </View>
            <Bottom style={styles.buttom}/>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'space-between',
        alignItems: 'stretch',
        // alignContent: 'flex-end',
    },
    header : {
        height: '10%',
    },
    content : {
        backgroundColor: '#f5ee0b',
        height: '80%',
    },
    bottom : {
        height: 40,
    },
})