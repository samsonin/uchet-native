import React, {useContext, useState} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";

import Context from "../context";


const allowedOrders = [
    {stock_id: 1, order_id: 23611},
    {stock_id: 1, order_id: 23611},
    {stock_id: 1, order_id: 23611},
    {stock_id: 2, order_id: 11898},
    {stock_id: 2, order_id: 11899},
    {stock_id: 7, order_id: 28},
    {stock_id: 7, order_id: 29},
    {stock_id: 7, order_id: 30},
]

export const Good = props => {

    const [orderId, setOrderId] = useState(1)

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

        <Button
            style={styles.button}
            title="в заказ"
            disabled={!orderId}
            onPress={() => console.log('в заказ ' + orderId)}
        />

    </View>

}

const styles = StyleSheet.create({
    view: {
        margin: 3,
        backgroundColor: 'white',
    },
    header: {
        // flex: 1
    },
    title: {
        marginLeft: 1,
        fontSize: 30,
    },
    button: {
        borderBottomWidth: 1,
        borderBottomColor: 'darkslateblue',
        margin: '3rem',
    }
})