import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {ListViewComponent, StyleSheet, Text, View} from 'react-native';


import {Header} from './src/components/Header'

import {MainContent} from './src/components/MainContent';
import {Bottom} from './src/components/Bottom';
import { Auth } from "./src/components/Auth";

export default function App() {

    const [auth, setAuth] = useState({
        user_id: 0,
        jwt: '',
        organization_id: 0,
        admin: false,
        expiration_time: 0,
    });
    const [contentId, setContentId] = useState(0);

    console.log(auth);

    return <View style={styles.container}>
            <Header isAuth={auth.user_id > 0} style={styles.header}/>
            {auth.user_id > 0
                ? <View style={styles.content}>
                    <Text>MainContent</Text>
                </View>
                : <Auth auth={auth} setAuth={setAuth}/>}
            {auth.user_id > 0
                ? <Bottom
                    style={styles.buttom}
                    setContentId={setContentId}
                />
                : null}
            <StatusBar style="auto"/>
        </View>
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
