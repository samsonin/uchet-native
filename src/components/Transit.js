import React, {useContext} from "react";
import {Text} from "react-native";

import Context from "../context";


export const Transit = () => {

    const {app} = useContext(Context)

    let user = app.users.find(u => u.id === 4)

    console.log()

    return <Text>Transit</Text>

}