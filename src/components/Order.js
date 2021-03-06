import React, {useContext, useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import rest from '../common/Rest'
import Context from "../context";
import ActivityIndicator from './ActivityIndicator';
import {Ionicons} from "@expo/vector-icons";


export const Order = ({currentOrder, closeOrder}) => {

    const {app} = useContext(Context)

    const [order, setOrder] = useState(() => {

        return app.orders
            ? app.orders.find(or => or.order_id === currentOrder.order_id && or.stock_id === currentOrder.stock_id)
            : null

    })

    // useEffect(() => {
    //
    //     if (!order) {
    //
    //         rest('orders/' + currentOrder.stock_id + '/' + currentOrder.order_id)
    //             .then(res => {
    //
    //                 if (res.status === 200) {
    //
    //                     setOrder(res.body)
    //
    //                 }
    //
    //             })
    //     }
    //
    // }, [])

    const renderOrderText = ({order_id, stock_id}) => {

        return <Text style={styles.title}>
            {app.stock_id === stock_id
                ? '#' + order_id
                : app.stocks.find(s => s.id === stock_id).name + ' #' + order_id}
        </Text>
    }


    return order
        ? order.id > 0
            ? <ScrollView style={styles.view}>

                <View style={styles.actions}>

                    <TouchableOpacity
                        onPress={() => closeOrder()}
                    >
                        <Ionicons
                            name={(Platform.OS === 'ios' ? 'ios' : 'md') + '-chevron-back-outline'}
                            size={24}
                            color={Platform.OS === 'ios' ? "blue" : "black"}
                        />

                    </TouchableOpacity>

                </View>

                <View style={styles.header}>

                    {renderOrderText(currentOrder)}

                </View>

                <Text>
                    {JSON.stringify(order)}
                </Text>

            </ScrollView>
            : <View style={styles.emptyView}>
                <Text>Заказ не найден</Text>
            </View>
        : <ActivityIndicator/>

}

const styles = StyleSheet.create({
    view: {
        flex: 1
    },
    emptyView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '50%'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        marginVertical: 14,
        backgroundColor: '#e9dbdb',
    },
    title: {
        fontSize: 30,
    },
})