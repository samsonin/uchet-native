import React from 'react';
import {Input} from "react-native-elements";

export default function (props) {

  console.log('props', props)

  return <Input
    style={{
      width: '100%',
      padding: 1,
    }}
    type={props.type}
    label={props.label}
    value={props.value}
    onChange={props.onChange}
    placeholder={props.value}
  />

}
