import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {Account} from './Account';
import {Menu} from './Menu';

export const Header = () => {
    return <View style={styles.header}>
        <Menu />
        <Text style={styles.text}
              onPress={() => console.log('brand press')}
        >
            Uchet.Store
        </Text>
        <Account />
    </View>
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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