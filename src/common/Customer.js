import React, {useContext, useRef, useState} from "react";
import rest from './Rest'

import {Button, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import ActivityIndicator from "../components/ActivityIndicator";

import RBSheet from "react-native-raw-bottom-sheet";
import Context from "../context";
import {Input} from "react-native-elements";

const types = {
    birthday: 'date',
    doc_date: 'date',
}

export const Customer = props => {

    const [isRequesting, setRequesting] = useState(false)
    const [serverCustomer, setServerCustomer] = useState({})
    const [customer, setCustomer] = useState({})
    const [isDetails, setDetails] = useState(false)

    const {app} = useContext(Context)
    const refRBSheet = useRef();


    const initial = customer => {

        setServerCustomer({...customer})
        setCustomer({...customer})
    }

    const create = () => {
        setRequesting(true)
        rest('customers',
            'POST',
            customer
        )
            .then(res => {
                setRequesting(false)
            })
    }

    const update = () => {

        setRequesting(true)

        rest('customers/' + customer.id,
            'PUT',
            customer
        )
            .then(res => {
                setRequesting(false)
                if (res.ok) initial(res.body.customers[0])
            })
    }

    const reset = () => setCustomer({...serverCustomer})

    const handleChange = (name, value) => setCustomer(prev => ({...prev, [name]: value}))

    let id = props.id || 0;

    if (!isRequesting && id > 0 && customer.id === undefined) {

        setRequesting(true)
        rest('customers/' + id)
            .then(res => {
                if (res.ok) initial(res.body)
                setRequesting(false)
            })

    }

    const isEqual = JSON.stringify(serverCustomer) === JSON.stringify(customer)

    return <View
        style={styles.view}
    >

        {isRequesting && <ActivityIndicator/>}

        <View
            style={styles.controls}
        >

            <TouchableOpacity
                onPress={() => props.setId('')}
            >
                <Ionicons
                    name={(Platform.OS === 'ios' ? 'ios' : 'md') + '-chevron-back-outline'}
                    size={24}
                    color={Platform.OS === 'ios' ? "blue" : "black"}
                />

            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setDetails(!isDetails)}
            >
                <MaterialIcons
                    name={isDetails
                        ? 'expand-less'
                        : 'expand-more'
                    }
                    size={24}
                    color={Platform.OS === 'ios' ? "blue" : "black"}
                />

            </TouchableOpacity>

        </View>

        <ScrollView>
            {typeof app.fields === 'object' && app.fields.allElements
                .filter(field => field.index === 'customer' && field.is_valid)
                .filter(field => isDetails || ['fio', 'phone_number'].includes(field.name))
                .map(field => field.name === 'referal_id'
                    ? <TouchableOpacity
                        style={styles.referalId}
                        key={'custfielviewkey' + field.id}
                        onPress={() => refRBSheet.current.open()}
                    >
                        <Text
                            style={styles.text}
                        >
                            Откуда узнали о нас
                        </Text>
                    </TouchableOpacity>
                    : <Input
                        label={field.value}
                        value={customer[field.name]}
                        onChangeText={text => handleChange(field.name, text)}
                        field={field}
                        key={'custfielviewkey' + field.id}
                        disabled={isRequesting}
                    />)}
        </ScrollView>

        {isEqual || isRequesting || <View
            style={styles.buttons}
        >
            <Button
                title="Отмена"
                onPress={() => reset()}
            />
            {props.id > 0
            ? <Button
                title="Сохранить"
                onPress={() => update()}
            />
            : <Button
                title="Создать"
                onPress={() => create()}
            />}
        </View>}

        <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={false}
        >
            <ScrollView>
                {app.referals.map(r => r.is_valid && <Button
                    color="#999"
                    key={'customerviewreferalsbuttonsk' + r.id}
                    style={styles.scrollButton}
                    title={r.name}
                    onPress={() => console.log(r.id)}
                />)}
            </ScrollView>
        </RBSheet>
    </View>

}

const styles = StyleSheet.create({
    view: {
        backgroundColor: "white",
        margin: 2,
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'black'
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        marginBottom: 14,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    referalId: {
        height: 50,
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
    scrollButton: {
        backgroundColor: "#030303"
    }
})