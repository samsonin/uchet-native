import React from 'react';
import {Input} from "react-native-elements";
import {StyleSheet} from "react-native";

export default function ({label, value, onChange}) {

  return <Input
    label={label}
    value={value}
    onChange={onChange}
  />

}