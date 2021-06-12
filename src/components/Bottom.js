import React, {useState} from 'react'
import {View, StyleSheet} from 'react-native'

import {TabBarIcon} from './TabBarIcon'

const icons = [
    {id: 1, text: 'Заказы', name: 'hammer'},
    {id: 2, text: 'Склад', name: 'home'},
    {id: 3, text: 'Сканировать', name: 'barcode'},
    {id: 4, text: 'Контрагенты', name: 'people'},
    {id: 5, text: 'Аналитика', name: 'trending-up'},
]

export const Bottom = ({subMenu}) => {

    const [focusId, setFocusId] = useState(0)

    const handle = i => {
        setFocusId(i)
        subMenu(i)
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
    }
})