import React from 'react'
import {Button, View, StyleSheet, TouchableOpacity} from "react-native";


const items = [
    [
        {id: 11, title: 'Новый заказ'},
        {id: 1, title: 'Все заказы'},
    ],
    [
        {id: 2, title: 'Накладные'},
        {id: 3, title: 'Транзит'},
        // {id: 4, title: 'Брак'},
    ],
    [],
    [
        {id: 5, title: 'Физ. лица'},
        // {id: 6, title: 'Юр. лица'},
        // {id: 7, title: 'Записи разговоров'},
    ],
    [
        {id: 8, title: 'Ежедневный отчет'},
        {id: 9, title: 'Зарплата'},
        // {id: 10, title: 'Движение денег'},
    ],
]

export const SubMenu = props => {
    return <View style={styles.view}>
        {items[props.id - 1].map(b => <TouchableOpacity
            key={'btnkeyinsubm' + b.id}
            style={styles.div}
        >
            <Button
                style={styles.button}
                title={b.title}
                onPress={() => {
                    props.setContentId(b.id)
                    props.setSubMenuVisible(false)
                }}
            />
        </TouchableOpacity>)}
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