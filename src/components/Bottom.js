import React, {useState} from 'react'
import {View, StyleSheet} from 'react-native'

import {TabBarIcon} from './TabBarIcon'
import rest from '../common/Rest';

const icons = [
    {id: 1, text: 'Заказы', name: 'hammer'},
    {id: 2, text: 'Склад', name: 'home'},
    {id: 3, text: 'Контрагенты', name: 'people'},
    {id: 4, text: 'Аналитика', name: 'trending-up'},
]

export const Bottom = props => {

    const [focusId, setFocusId] = useState(0);

    const handle = i => {
        setFocusId(i)
        props.subMenu(i)
    }

    return <View style={styles.bottom}>
        {icons.map(i => <TabBarIcon
            id={i.id}
            key={'tabbariconskey' + i.name}
            onPress={handle}
            focused={focusId === i.id}
            text={i.text}
            name={
                (Platform.OS === 'ios'
                    ? 'ios-'
                    : 'md-' ) + i.name
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