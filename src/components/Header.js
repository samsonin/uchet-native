import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {Account} from './Account';
import {Menu} from './Menu';

export const Header = props => {

    return <View style={styles.header}>
        {props.isAuth
            ? <Menu leftMenuHandler={props.leftMenuHandler}/>
            : null}
        <Text style={styles.text}
              onPress={() => console.log('brand press')}
        >
            Uchet.Store
        </Text>
        {props.isAuth
            ? <Account accountMenuHandler={props.accountMenuHandler}/>
            : null}
    </View>
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        // alignContent: 'center',
        justifyContent: 'space-between',
        // justifyContent: 'center',
        backgroundColor: '#3c7a65',
        paddingTop: 40,
        paddingBottom: 5,
        paddingHorizontal: 14
    },
    text: {
        fontSize: 24,
        color: 'white',
    },
})