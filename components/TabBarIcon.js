import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {View, Text, StyleSheet} from "react-native";

export const TabBarIcon = props => {
  return <View style={styles.view}>
    <Ionicons
      name={props.name}
      size={33}
      color={props.focused ? '#2f95dc' : '#ccc'}
    />
    <Text
        color={props.focused ? '#2f95dc' : '#ccc'}
    >
      {props.text}
    </Text>
  </View>
}

const styles = StyleSheet.create({
  view: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
  },
})