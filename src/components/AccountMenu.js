import React from 'react'
import {Text, View, StyleSheet} from "react-native";
import {FontAwesome} from '@expo/vector-icons';


export const AccountMenu = props => {
    return <View style={styles.view} >
        <Text>
            Имя
        </Text>
        <FontAwesome.Button
            style={styles.button}
            name={'sign-out'}
            backgroundColor={"#0c8098"}
            onPress={() => props.setInitialAuth()}
        >
            Exit
        </FontAwesome.Button>
    </View>
}

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        zIndex: 2,
        right: 10,
        top: 10,
        backgroundColor: '#f8f8f8',
        width: '30%',
        alignSelf: 'flex-end',
        padding: 2,
    },
    button: {
        borderColor: '#9c9c9c',
        borderWidth: 1,
    }
})