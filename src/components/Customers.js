import React, {useState} from "react";
import {Text, TouchableOpacity, View, TextInput, StyleSheet, ScrollView} from "react-native";
import {EvilIcons} from '@expo/vector-icons';
import {Ionicons} from '@expo/vector-icons';

import rest from '../common/Rest'
import ActivityIndicator from './ActivityIndicator'
import {Customer} from "../common/Customer";


export const Customers = () => {

    const [searchStr, setSearchStr] = useState()
    const [customers, setCustomers] = useState(false)
    const [id, setId] = useState()
    const [requesting, setRequesting] = useState(false)

    const searchHandler = text => {

        setSearchStr(text)

        if (!requesting) {

            setRequesting(true)

            let url = text
                ? 'customers?all=' + text
                : 'customers'

            rest(url)
                .then(res => {
                    if (res.ok) setCustomers(res.body);
                    setRequesting(false)
                })
        }

    }

    if (!requesting && !customers) searchHandler();

    return Number.isInteger(id)
        ? <Customer id={id} setId={setId}/>
        : customers
            ? <View
                style={styles.view}
            >

                <View
                    style={styles.title}
                >
                    <Text
                        style={styles.titleText}
                    >
                        Физ. лица
                    </Text>
                    <TouchableOpacity
                        onPress={() => setId(0)}
                    >
                        <Ionicons
                            name={(Platform.OS === 'ios' ? 'ios' : 'md') + '-person-add'}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>

                <View
                    style={styles.searchContainer}
                >
                    <TextInput
                        style={styles.input}
                        onChangeText={text => searchHandler(text)}
                        autoFocus
                        value={searchStr}
                    />
                    <EvilIcons
                        name="search"
                        size={30}
                        color="black"
                    />
                </View>

                <ScrollView
                    onScrollToTop={() => console.log('onScrollToTop')}
                    // onScroll={() => console.log('onScroll')}
                >
                    {customers.map(c => <TouchableOpacity
                            style={styles.touchable}
                            key={'touchopaccustomerskey' + c.id}
                            onPress={() => setId(+c.id)}
                        >
                            <Text
                                style={styles.fio}
                            >
                                {c.fio}
                            </Text>
                            <Text
                                style={styles.phone}
                            >
                                {c.phone_number}
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>

            </View>
            : <ActivityIndicator/>

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
    title: {
        flexDirection: 'row',
        paddingVertical: 2,
        marginVertical: 10,
        paddingHorizontal: 10,
        marginHorizontal: 8,
    },
    titleText: {
        flex: 1,
        fontSize: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingVertical: 2,
        marginVertical: 10,
        paddingHorizontal: 10,
        marginHorizontal: 8,
    },
    input: {
        flex: 1,
    },
    touchable: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 8,
    },
    fio: {
        width: '70%',
    },
    phone: {
        marginLeft: 8,
    },
})