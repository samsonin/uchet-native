import {Icon} from "react-native-elements";
import React from "react";

export const Account = () => {
    return <Icon
        color={'white'}
        name={'account-circle'}
        onPress={() => console.log('account press')}
    />
}
