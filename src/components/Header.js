import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {Account} from './Account';
import {Menu} from './Menu';

export const Header = props => {
    return <View style={styles.header}>
        {props.isAuth
            ? <Menu/>
            : null}
        <Text style={styles.text}
              onPress={() => console.log('brand press')}
        >
            Uchet.Store
        </Text>
        {props.isAuth
            ? <Account/>
            : null}
    </View>
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        justifyContent: 'center',
        backgroundColor: '#3c7a65',
        paddingTop: 40,
        paddingBottom: 5,
        paddingHorizontal: 14
    },
    text: {
        alignContent: 'center',
        fontSize: 24,
        color: 'white',
    },
})