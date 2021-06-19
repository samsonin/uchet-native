import React, {useContext} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Input} from "react-native-elements";
import Context from "../context";


export const TransitItemInfo = props => {

    const {app} = useContext(Context)

    return <ScrollView style={styles.view}>

        <View style={styles.actions}>

            <TouchableOpacity
                onPress={() => props.setDetails()}
            >
                <Ionicons
                    name={(Platform.OS === 'ios' ? 'ios' : 'md') + '-chevron-back-outline'}
                    size={24}
                    color={Platform.OS === 'ios' ? "blue" : "black"}
                />

            </TouchableOpacity>

            {!app.stock_id || <TouchableOpacity
                style={styles.icon}
                onPress={() => props.fromTransit(props.good)}
            >
                {Platform.OS === 'ios'
                    ? <Ionicons name="ios-checkmark-sharp" size={24} color="blue"/>
                    : <Ionicons name="md-checkmark-sharp" size={24} color="black"/>}
            </TouchableOpacity>}

        </View>

        <View style={styles.header}>

            <Text style={styles.title}>
                {'#' + props.good.id}
            </Text>

        </View>
        {[
            {name: "Наименование", value: props.good.model},
            {name: "Откуда", value: props.good.stock},
            {name: "Время передачи в транзит", value: props.good.outtime},
            {name: "Ответственный", value: props.good.user},
        ].map(g => <Input
            key={'transititemindetailstransitview' + g.name}
            label={g.name}
            value={g.value}
        />)}

    </ScrollView>

}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "white",
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'black'
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
    item: {
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