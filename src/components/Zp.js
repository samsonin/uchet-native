import React from "react";
import {StyleSheet, Text, View} from "react-native";

export const Zp = () => {

    return <View style={styles.emptyView}>
        <Text>К сожалению, Вы ничего не заработали</Text>
    </View>
}

const styles = StyleSheet.create({
    emptyView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '50%'
    },
})