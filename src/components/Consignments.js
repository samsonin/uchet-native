import React, {useContext, useEffect, useRef, useState} from "react";
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import rest from '../common/Rest'
import Context from "../context";
import ActivityIndicator from './ActivityIndicator';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';


export const Consignments = props => {

    const [data, setData] = useState()

    const {app} = useContext(Context)

    const init = () => {

        rest('consignments/' + app.stock_id)
            .then(res => {
                if (res.status === 200) {
                    setData(res.body)
                }
            })

    }

    useEffect(() => {

        init()

    }, [])

    const del = ({provider_id, consignment_number}) => {

        console.log(provider_id, consignment_number)

        rest('consignments/' + provider_id + '/' + consignment_number, 'DELETE')
            .then(res => {

                console.log(res)

                if (res.status === 200) {

                    Alert.alert('Ок', 'Удалено!')
                    init()

                } else {

                    Alert.alert('Ошибка', res.error[0])
                    init()

                }

            })

    }

    return data
        ? data.length > 0
            ? <ScrollView style={styles.view}>
                {data.map(c => <View
                    key={'consinview' + c.provider_id + c.consignment_number}
                    style={styles.cons}
                >
                    <Text>
                        {app.providers.find(p => p.id === +c.provider_id).name + ', ' + c.consignment_number}
                    </Text>

                    <TouchableOpacity
                        // style={styles.actionIcon}
                        onPress={() => del(c)}
                    >
                        {Platform.OS === 'ios'
                            ? <Ionicons name="ios-remove-circle" size={24} color="red"/>
                            : <MaterialIcons name="delete" size={30} color="red"/>}
                    </TouchableOpacity>

                </View>)}
            </ScrollView>
            : <View style={styles.emptyView}>
                <Text>
                    Сегодня не было накладных
                </Text>
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

    cons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        margin: 3,
        padding: 8,
        backgroundColor: '#eee',
    }
})