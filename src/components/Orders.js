import React, {useContext, useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import rest from '../common/Rest'
import Context from "../context";
import ActivityIndicator from './ActivityIndicator';


export const Orders = props => {

    const [orders, setOrders] = useState()

    const {app} = useContext(Context)

    useEffect(() => {

        rest('allowedOrders')
            .then(res => {
                if (res.status === 200) {
                    setOrders(res.body)
                }
            })

    }, [])

    const renderOrderText = ({order_id, stock_id}) => <Text>
        {app.stock_id === stock_id
            ? order_id
            : app && app.stocks.find(s => s.id === stock_id).name + ', ' + order_id}
    </Text>


    return orders
        ? orders.length > 0
            ? <ScrollView style={styles.view}>
                {orders.map(o => {

                    const status = app.statuses.find(s => s.id === o.status_id)

                    const color = status
                        ? status.color || 'eee'
                        : 'eee'

                    return <TouchableOpacity
                        style={styles(color).orderButton}
                        key={'orderstou' + o.order_id + o.stock_id}
                        onPress={() => props.openOrder(o)}
                    >
                        {renderOrderText(o)}
                    </TouchableOpacity>
                })}
            </ScrollView>

            : <View style={styles.emptyView}>
                <Text>У вас нет активных заказов</Text>
            </View>

        : <ActivityIndicator/>


}

const styles = (color = 'eee') => StyleSheet.create({
    view: {
        flex: 1
    },
    emptyView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '50%'
    },
    orderButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        margin: 3,
        padding: 8,
        backgroundColor: '#' + color,
    }
})