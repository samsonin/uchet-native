import React from 'react'
import {View, StyleSheet} from 'react-native'
import {TabBarIcon} from '../components/TabBarIcon'


const icons = [
    {text: 'Заказы', name: 'hammer'},
    {text: 'Склад', name: 'home'},
    {text: 'Контрагенты', name: 'people'},
    {text: 'Cделки', name: 'trending-up'},
]

export const Bottom = () => {
    return <View style={styles.bottom}>
        {icons.map(i => <TabBarIcon
            key={'tabbariconskey' + i.name}
            text={i.text}
            name={
                (Platform.OS === 'ios'
                    ? 'ios'
                    : 'md' ) + '-' + i.name
            }
        />)}
    </View>
}

const styles = StyleSheet.create({
    bottom: {
        paddingBottom: 20,
        paddingTop: 8,
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        borderTopWidth: .2,
        borderTopColor: '#9c9c9c',
    },
    text: {
        fontSize: 24,
        color: 'black',
    },
})