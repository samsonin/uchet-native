import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Text, StyleSheet, TouchableOpacity} from "react-native";

export const TabBarIcon = props => {

    const color = props.focused ? '#2f95dc' : '#ccc';

    return <TouchableOpacity
        onPress={() => props.onPress(props.id)}
        style={styles.view}
    >
        <Ionicons
            name={props.name}
            size={28}
            style={{color}}
        />
        <Text
            style={{color}}
        >
            {props.text}
        </Text>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    view: {
        width: '25%',
        height: '100%',
        alignItems: 'center',
    },
})