import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {FontAwesome} from "@expo/vector-icons";

export const LeftMenu = props => {

    return <View style={styles.view}>
        <FontAwesome.Button
            style={styles.button}
            name={'barcode'}
            backgroundColor={"#0c8098"}
            onPress={() => props.setIsBarcodeOpen(true)}
        >
            Сканировать
        </FontAwesome.Button>

    </View>
}

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        zIndex: 2,
        left: 10,
        top: 10,
        backgroundColor: '#f8f8f8',
        width: '50%',
        alignSelf: 'flex-end',
        padding: 2,
    },
    button: {
        borderColor: '#9c9c9c',
        borderWidth: 1,
        margin: 2,
    }
})