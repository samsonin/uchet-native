import {Icon} from "react-native-elements";
import React from "react";

export const Account = () => {
    return <Icon
        style={{paddingTop: 4}}
        // size={22}
        color={'white'}
        name={'account-circle'}
        onPress={() => console.log('account press')}
    />
}
