import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {ListViewComponent, StyleSheet, Text, View} from 'react-native';


import {Header} from './src/components/Header'

import {MainContent} from './src/components/MainContent';
import {Bottom} from './src/components/Bottom';
import {Auth} from './src/components/Auth';
import {AccountMenu} from './src/components/AccountMenu'

export default function App() {

    const [auth, setAuth] = useState({
        user_id: 0,
        jwt: '',
        organization_id: 0,
        admin: false,
        expiration_time: 0,
    });
    const [contentId, setContentId] = useState(0);

    const [isAccountMenuShow, setAccountMenuShow] = useState(false)

    const accountMenuHandler = () => {
        console.log('accountMenuHandler')
        setAccountMenuShow(!isAccountMenuShow)
    }

    return <View style={styles.container}>
        <Header
            isAuth={auth.user_id > 0}
            accountMenuHandler={accountMenuHandler}
            style={styles.header}
        />
        {isAccountMenuShow
            ? <AccountMenu
                style={styles.account}
            />
            : null}
        {auth.user_id > 0
            ? <View style={styles.content}>
                <Text>
                    main content
                </Text>
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
    account: {
        zIndex: 8,
        position: 'absolute',
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,

        // alignSelf: 'flex-end'
    },
    content: {
        padding: 4,
        backgroundColor: '#f5ee0b',
        height: '80%',
    },
    bottom: {
        height: 40,
    },
})
