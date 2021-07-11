import React, {useContext, useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import Context from "../context";
import ActivityIndicator from "./ActivityIndicator";
import {Ionicons} from "@expo/vector-icons";

import rest from '../common/Rest'
import {TransitItemInfo} from './TransitItemInfo'
import Toast from "react-native-root-toast";

export const Transit = () => {

    const [requesting, setRequesting] = useState(false)
    const [details, setDetails] = useState()

    const {app, updApp} = useContext(Context)

    const fromTransit = good => {

        if (requesting) return

        setRequesting(true)

        rest('transit/' + app.stock_id + '/' + good.barcode, 'DELETE')
            .then(res => {

                setRequesting(false)

                if (res.status === 200) {

                    updApp(res.body)

                    Toast.show('ok')

                    setDetails(null)

                } else {

                    // console.log(res)

                    Toast.show('error')

                }

            })
    }

    const renderTransitItem = good => <View
        key={'gooditemintransitviekey' + good.barcode}
        style={styles.item}
    >

        <Text style={styles.text}>
            {good.model}
        </Text>

        <View style={styles.actionIcons}>
            <TouchableOpacity
                disabled={requesting}
                onPress={() => setDetails(good.barcode)}
                style={styles.icon}
            >
                {Platform.OS === 'ios'
                    ? <Ionicons name="ios-information-circle-outline" size={24} color="blue"/>
                    : <Ionicons name="md-information-circle-outline" size={24} color="black"/>}
            </TouchableOpacity>

            {!app.stock_id || <TouchableOpacity
                disabled={requesting}
                style={styles.icon}
                onPress={() => fromTransit(good)}
            >
                {Platform.OS === 'ios'
                    ? <Ionicons name="ios-checkmark-circle-outline" size={24} color="blue"/>
                    : <Ionicons name="md-checkmark-circle-outline" size={24} color="black"/>}
            </TouchableOpacity>}
        </View>

    </View>

    const goodDetails = app.transit.find(t => t.barcode === details)

    useEffect(() => {

        if (!goodDetails) setDetails()

    }, [app.transit])


    return app.transit.length > 0
        ? <ScrollView style={styles.view}>

            {requesting && <ActivityIndicator/>}

            <View style={{
                opacity: requesting ? .6 : 1
            }}>
                {goodDetails
                    ? <TransitItemInfo
                        good={goodDetails}
                        setDetails={setDetails}
                        fromTransit={fromTransit}
                    />
                    : app.transit.map(good => {

                        good.id = +good.barcode.toString().substr(6, 6)
                        let stock = app.stocks.find(st => st.id === good.stock_id)
                        let user = app.users.find(u => u.id === good.responsible_id)

                        good.stock = stock
                            ? stock.name
                            : ''

                        good.user = user
                            ? user.name
                            : ''

                        return renderTransitItem(good)

                    })}
            </View>
        </ScrollView>
        : <View style={styles.emptyView}>
            <Text>В транзите ничего нет</Text>
        </View>

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
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        margin: 3,
        padding: 8,
        backgroundColor: '#eee',
    },
    text: {
        width: '70%'
    },
    actionIcons: {
        flexDirection: 'row',
    },
    icon: {
        margin: 4,
        padding: 4
    }
})