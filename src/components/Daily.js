import React from "react";
import {StyleSheet, Text, View} from "react-native";

export const Daily = () => {

    return <View style={styles.emptyView}>
        <Text>Данные за сегодня отсутствуют</Text>
    </View>
}

const styles = StyleSheet.create({
    emptyView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '50%'
    },
})