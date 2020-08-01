import React, {useState} from 'react'
import {Button, View} from "react-native";
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';


export const AccountMenu = () => {
    return <View
        // style={{
        //     zIndex: 999
        // }}
    >
        <Button
            onPress={() => console.log('accountMenuButtonPress')}
            title={'AccountMenu'}
        >

        </Button>
    </View>
}