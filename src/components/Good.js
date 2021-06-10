import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View} from "react-native";

import Context from "../context";
import RBSheet from "react-native-raw-bottom-sheet";
import rest from '../common/Rest'
import ActivityIndicator from "./ActivityIndicator";


const fontSize = 18

export const Good = props => {

    const [allowedOrders, setAllowedOrders] = useState([])
    const [currentOrder, setCurrentOrder] = useState()
    const [sum, setSum] = useState(props.good.sum.toString())
    const [requesting, setRequesting] = useState(false)
    const [wo, setWo] = useState(() => props.good.wo)

    const {auth, app} = useContext(Context)

    const refRBSheet = useRef()

    const response = (res, okMessage) => {

        setRequesting(false)

        const message = res.status === 200
            ? okMessage
            : 'ошибка: ' + res.body.error

        if (Platform.OS === 'android') ToastAndroid.show(message, 5)
        else alert(message)

        if (res.status === 200) setWo(true)

    }

    const toOrder = () => {

        if (requesting) return

        setRequesting(true)

        rest('orders/' + currentOrder.stock_id + '/' + currentOrder.order_id + '/' + props.good.barcode,
            'POST')
            .then(res => response(res, 'ок, в заказе!'))

    }

    const toSale = () => {

        if (requesting) return

        setRequesting(true)

        rest('sales/' + props.good.barcode + '/' + sum, 'POST')
            .then(res => response(res, 'ок, продано!'))

    }

    const makeTitle = ({stock_id, order_id}) => stock_id === app.stock_id
        ? order_id.toString()
        : app.stocks.find(s => s.id === stock_id).name + ', ' + order_id

    const toNumber = v => setSum(prev => +v == v ? v : prev)

    useEffect(() => {

        rest('allowedOrders')
            .then(res => {

                if (res.status === 200) {

                    setAllowedOrders(res.body)
                    setCurrentOrder(res.body[0])

                }

            })

    }, [])

    const position = app.positions.find(p => p.id === auth.position_id)

    let category = app.categories.find(c => c.id === props.good.category_id)
    let categoryName = category
        ? category.name
        : 'не определена'

    return <View style={styles.view}>

        {requesting && <ActivityIndicator/>}

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
                marginBottom: 50
            }}
        >
            {'Поставщик : ' + app.providers.find(p => p.id === props.good.provider_id).name}
        </Text>


        {!props.good.wo && !requesting && !wo && <>

            {position.is_sale && <View style={styles.rowView}
            >
                <TextInput
                    style={{
                        fontSize: fontSize + 8
                    }}
                    value={sum}
                    onChangeText={v => toNumber(v)}
                    keyboardType="numeric"
                />
                <Button
                    onPress={() => toSale()}
                    title="продать"/>
            </View>}

            {currentOrder && (<View style={styles.rowView}
            ><Button
                title={makeTitle(currentOrder)}
                onPress={() => refRBSheet.current.open()}
            />
                <Button
                    title="в заказ..."
                    onPress={() => toOrder()}
                />
            </View>)}

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
                        title={makeTitle(o)}
                        onPress={() => {
                            refRBSheet.current.close()
                            setCurrentOrder(o)
                        }}
                    />)}
                </ScrollView>
            </RBSheet>

        </>}
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
    rowView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    button: {
        margin: 5,
    },
    scrollButton: {
        color: '#234234'
    }
})