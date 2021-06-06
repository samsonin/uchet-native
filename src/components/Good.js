import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";

import Context from "../context";
import RBSheet from "react-native-raw-bottom-sheet";
import rest from '../common/Rest'


const fontSize = 18

export const Good = props => {

    const [allowedOrders, setAllowedOrders] = useState([])

    const {app} = useContext(Context)

    const refRBSheet = useRef()

    const toOrder = (stock_id, order_id) => {

        console.log(stock_id, order_id)

    }

    useEffect(() => {

        rest('allowedOrders')
            .then(res => {

                if (res.status === 200) {

                    setAllowedOrders(res.body)

                }

            })

    }, [])

    // console.log(props.good)

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

        <Text
            style={{
                alignSelf: 'center',
                fontSize: fontSize
            }}
        >
            {categoryName}
        </Text>

        <Text
            style={{
                alignSelf: 'center',
                fontSize: fontSize + 4
            }}
        >
            {props.good.model}
        </Text>

        {!!props.good.imei && <Text
            style={{
                alignSelf: 'center',
                fontSize: fontSize
            }}
        >
            {props.good.imei}
        </Text>}

        <Text
            style={{
                alignSelf: 'center',
                fontSize: fontSize
            }}
        >
            {'Себестоимость: ' + (props.good.remcost || props.good.cost)}
        </Text>

        <Text
            style={{
                alignSelf: 'center',
                fontSize: fontSize
            }}
        >
            {'Оприходовали: ' + props.good.time}
        </Text>

        <Text
            style={{
                alignSelf: 'center',
                fontSize: fontSize,
                marginBottom: 20
            }}
        >
            {'Поставщик : ' + app.providers.find(p => p.id === props.good.provider_id).name}
        </Text>



        <Button
            style={{
                margin: 5,
            }}
            title="в заказ..."
            onPress={() => refRBSheet.current.open()}
        />

        <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={200}
        >
            <ScrollView>
                {allowedOrders.map(o => <Button
                    color="#999"
                    key={'customerviewrallowedOrders' + o.stock_id + o.order_id}
                    style={styles.scrollButton}
                    title={o.stock_id === app.stock_id
                        ? o.order_id.toString()
                        : app.stocks.find(s => s.id === o.stock_id).name + ', ' + o.order_id}
                    onPress={() => toOrder(o.stock_id, o.order_id)}
                />)}
            </ScrollView>
        </RBSheet>

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
        margin: 5,
    },
    scrollButton: {
        color: '#234234'
    }
})