import { Ionicons } from '@expo/vector-icons';
import React from "react";

export const Menu = props => {
    return <Ionicons
        size={30}
        color={'white'}
        name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
        onPress={() => props.leftMenuHandler()}
    />
}
