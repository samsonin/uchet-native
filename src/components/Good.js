import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";

import Context from "../context";
import RBSheet from "react-native-raw-bottom-sheet";
import rest from '../common/Rest'
import ActivityIndicator from "./ActivityIndicator";

import {FontAwesome} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import {Input} from "react-native-elements";
import Toast from 'react-native-root-toast';


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

        Toast.show(res.status === 200
            ? okMessage
            : 'ошибка: ' + res.body.error)

        if (res.status === 200) props.setGood()

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

        rest('sales/' + app.stock_id + '/' + props.good.barcode + '/' + sum, 'POST')
            .then(res => response(res, 'ок, продано!'))

    }

    const transit = isTo => {

        setRequesting(true)

        rest('transit/' + app.stock_id + '/' + props.good.barcode,
            isTo ? 'POST' : 'DELETE')
            .then(res => response(res, isTo ? 'ок, в транзите' : 'ок, в магазине'))
            .then(_ => setWo(false))

    }

    const toReject = () => {

        console.log('toReject')

        setRequesting(true)

        setTimeout(() => {

            setRequesting(false)

        }, 3000)

    }

    const toDeduct = () => {

        console.log('toDeduct')

        setRequesting(true)

        setTimeout(() => {

            setRequesting(false)

        }, 3000)

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

    let cost = (props.good.remcost || props.good.cost).toString()

    let provider = app.providers.find(p => p.id === props.good.provider_id)

    let wf = provider
        ? provider.name
        : typeof props.good.wf === 'string'
            ? props.good.wf
            : null


    return <ScrollView style={styles.view}>

        {requesting && <ActivityIndicator/>}

        <View style={styles.header}>

            <Text style={styles.title}>
                {'#' + props.good.id}
            </Text>

            {props.good.wo === 't' && <TouchableOpacity
                style={styles.actionIcon}
                onPress={() => transit(false)}
            >
                <FontAwesome name="truck" size={30} color="blue"/>
            </TouchableOpacity>}

            {!props.good.wo && !requesting && !wo && !!position.is_sale && <View
                style={styles.actionIcons}
            >
                <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => transit(true)}
                >
                    <FontAwesome name="truck" size={30} color="blue"/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => toReject()}
                >
                    <MaterialIcons name="assignment-return" size={30} color="orange"/>
                </TouchableOpacity>

                {auth.admin && <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => toDeduct()}
                >
                    <MaterialIcons name="delete" size={30} color="red"/>
                </TouchableOpacity>}

            </View>}

        </View>

        <View style={{
            backgroundColor: 'white',
            marginTop: 10,
            borderWidth: 1,
            borderRadius: 10,
            opacity: requesting ? .9 : 1
        }}>
            {[
                {label: 'категория', value: categoryName},
                {label: 'наименование', value: props.good.model},
                !!props.good.imei && {label: 'imei', value: props.good.imei},
                {label: 'себестоимость', value: cost},
                {label: 'оприходовали', value: props.good.time},
                !!props.good.wf && {label: 'откуда', value: wf},
            ].map(i => i && <Input
                key={'inputkeyimgood' + i.label}
                label={i.label}
                value={i.value}
                disabled={requesting}
            />)}

            {!props.good.wo && !requesting && !wo && <>

                {position.is_sale
                    ? <View style={styles.rowView}
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
                    </View>
                    : null}

                {currentOrder && <View style={styles.rowView}>
                    <Button
                        title={makeTitle(currentOrder)}
                        onPress={() => refRBSheet.current.open()}
                    />
                    <Button
                        title="в заказ..."
                        onPress={() => toOrder()}
                    />
                </View>}

            </>}

        </View>

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


    </ScrollView>

}

const styles = StyleSheet.create({
    view: {
        margin: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        backgroundColor: '#e9dbdb',
    },
    title: {
        fontSize: 30,
    },
    actionIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // width: 80,
    },
    actionIcon: {
        marginHorizontal: 4,
    },
    rowView: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-around'
    },
    button: {
        margin: 5,
    },
    scrollButton: {
        color: '#234234'
    }
})