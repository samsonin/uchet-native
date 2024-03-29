import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import rest from '../common/Rest'
import Context from "../context";
import ActivityIndicator from './ActivityIndicator';
import {Ionicons} from "@expo/vector-icons";
import {Input} from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";


export const Order = ({currentOrder, closeOrder}) => {

    const {app, updApp, auth} = useContext(Context)

    const [order, setOrder] = useState()

    const refRBSheet = useRef()

    const position = app.positions.find(p => p.id === auth.position_id)

    useEffect(() => {

        rest('orders/' + currentOrder.stock_id + '/' + currentOrder.order_id)

    }, [])

    useEffect(() => {

        const appOrder = app.orders
            ? app.orders.find(or => or.id === currentOrder.order_id && or.stock_id === currentOrder.stock_id)
            : null

        if (appOrder) setOrder(appOrder)

    }, [app.orders])

    const renderOrderText = ({order_id, stock_id}) => <Text style={styles.title}>
        {app.stock_id === stock_id
            ? '#' + order_id
            : app.stocks.find(s => s.id === stock_id).name + ' #' + order_id}
    </Text>

    // order && (order.order_id = order.id)

    const category = order && order.category_id
        ? app.categories.find(c => c.id === order.category_id)
        : 'Наименование'

    const status = order
        ? app.statuses.find(s => s.id === order.status_id)
        : null

    const customer = {
        fio: order
            ? order.customer_fio ?? order.client ?? 'Заказчик'
            : null,
        phone_number: order
            ? order.customer_phone_number ?? order.phone_number ?? null
            : null
    }

    const statusHandler = id => {

        const newOrder = {...order}

        newOrder.status_id = id

        updApp({orders: [newOrder]})

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

                    {renderOrderText(order)}

                </View>

                <View style={styles.body}>

                    {[
                        {label: category, value: order.model, disabled: true},
                        {label: 'Неисправность', value: order.defect, disabled: true},
                        {label: 'Сумма к оплате', value: order.sum2.toString(), disabled: false},
                        {
                            label: 'Статус',
                            value: status.name
                        },
                        {
                            label: 'Мастер',
                            value: app.users.find(u => u.id === order.master_id).name,
                            disabled: false
                        },
                        {
                            label: customer.fio,
                            value: customer.phone_number,
                            disabled: true
                        },
                    ].map(f => auth.user_id === order.master_id && f.label === 'Мастер'
                        ? null
                        : f.label === 'Статус'
                            ? <Pressable style={styles.status}
                                         key={'inputkeyinorder' + f.label + f.value}
                                         onPress={() => refRBSheet.current.open()}
                                         color={status.color}
                            >
                                <Text style={styles.statusText}>
                                    Статус: {status.name}
                                </Text>
                            </Pressable>
                            : <Input
                                key={'inputkeyinorder' + f.label + f.value}
                                label={f.label}
                                value={f.value}
                                disabled={f.disabled}
                            />)}

                </View>

                <Text>
                    {JSON.stringify(order)}
                </Text>

                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={200}
                >
                    <ScrollView>
                        {app.statuses.map(s => <Button
                            color={'#' + s.color}
                            key={'statusesinOrders' + s.id}
                            title={s.name}
                            onPress={() => {
                                refRBSheet.current.close()
                                statusHandler(s.id)
                            }}
                        />)}
                    </ScrollView>
                </RBSheet>

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
    body: {
        backgroundColor: 'white',
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
    status: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
    },
    statusText: {

    }
})