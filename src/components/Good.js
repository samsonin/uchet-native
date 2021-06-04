import React, {useContext, useState} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";

import Context from "../context";


export const Good = props => {

    const [orderId, setOrderId] = useState()

    const {app} = useContext(Context)

    let category = app.categories.find(c => c.id === props.good.category_id)
    let categoryName = category
        ? category.name
        : 'не определена'

    return <View style={styles.view}>

        <View style={styles.header}>

            <Text style={styles.title}>
                {'#' + props.good.id}
            </Text>

        </View>

        <Text>{categoryName}</Text>

        <Text>
            {categoryName}
        </Text>

        <View style={styles.line}>

            <TextInput
                style={styles.input}
                keyboardType="number-pad"
                autoFocus
                // inputAccessoryViewID={inputAccessoryViewID}
                onChangeText={v => setOrderId(prev => +v == v ? v : prev)}
                value={orderId}
            />

            <Button
                title="в заказ"
                disabled={!orderId}
                onPress={() => console.log('в заказ ' + orderId)}
            />

        </View>

    </View>

}

const styles = StyleSheet.create({
    view: {
        margin: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    header: {
        // flex: 1
    },
    title: {
        marginLeft: 1,
        fontSize: 30,
    },
    line: {
        // flex: 1,
        // justifyContent: 'space-between'
    },
    input: {
        fontSize: 20,
        width: '50%',
        borderBottomWidth: 1,
        borderBottomColor: 'darkslateblue',
        margin: 20,
    }
})