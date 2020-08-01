import {Icon} from "react-native-elements";
import React, {useState} from "react";
import {Text} from "react-native";

export const Account = props => {

    return <Icon
            style={{paddingTop: 4}}
            // size={22}
            color={'white'}
            name={'account-circle'}
            onPress={() => props.accountMenuHandler()}
        />
}
