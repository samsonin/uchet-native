import {Icon} from "react-native-elements";
import React from "react";

export const Account = props => {

    return <Icon
            style={{paddingTop: 4}}
            color={'white'}
            name={'account-circle'}
            onPress={() => props.accountMenuHandler()}
        />
}
