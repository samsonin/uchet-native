import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {Provider} from "react-redux";
import {ListViewComponent, StyleSheet, Text, View} from 'react-native';
import store from './src/store';


import {Header} from './src/components/Header'

import {MainContent} from './src/components/MainContent';
import {Bottom} from './src/components/Bottom';
import Auth from "./src/components/Auth";

export default function App() {

    const userId = +useState(store.getState().auth.user_id);
    const [contentId, setContentId] = useState(0);

    console.log(userId)

    return <Provider store={store}>
        <View style={styles.container}>
            <Header style={styles.header}/>
            {userId > 0
                ? <View style={styles.content}>
                    <Text>MainContent</Text>
                </View>
                : <Auth />}
            {userId > 0
                ? <Bottom
                    style={styles.buttom}
                    setContentId={setContentId}
                />
                : null}
            <StatusBar style="auto"/>
        </View>
    </Provider>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'space-between',
        alignItems: 'stretch',
        // alignContent: 'flex-end',
    },
    header: {
        height: '10%',
    },
    content: {
        backgroundColor: '#f5ee0b',
        height: '80%',
    },
    bottom: {
        height: 40,
    },
})
