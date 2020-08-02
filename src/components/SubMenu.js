import React, {useState} from 'react'
import {Button, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {FontAwesome} from '@expo/vector-icons';


const items = [
    [
        {id: 0, title: 'Новый заказ'},
        {id: 1, title: 'Все заказы'},
    ],
    [
        {id: 2, title: 'Весь склад'},
        {id: 3, title: 'Транзит'},
        {id: 4, title: 'Брак'},
    ],
    [
        {id: 5, title: 'Физ. лица'},
        {id: 6, title: 'Юр. лица'},
    ],
    [
        {id: 7, title: 'Ежедневный отчет'},
        {id: 8, title: 'Зарплата'},
        {id: 9, title: 'Инкасация'},
    ],
]

export const SubMenu = props => {
    return <View style={styles.view}>
        {
            items[props.id - 1].map(b => <TouchableOpacity
                    style={styles.div}
                >
                    <Button
                        key={'btnkeyinsubm' + b.id}
                        style={styles.button}
                        title={b.title}
                    />
                </TouchableOpacity>
            )
        }
    </View>
}

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        zIndex: 2,
        bottom: 1,
        backgroundColor: '#f8f8f8',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    div: {
        paddingVertical: 4,
    },
    button: {
        backgroundColor: 'grey',
        marginVertical: 10,
        paddingVertical: 5
    },
})