import { Ionicons } from '@expo/vector-icons';
import React from "react";

export const Menu = () => {
    return <Ionicons
        size={33}
        color={'white'}
        name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
        onPress={() => console.log('home press')}
    />
}
