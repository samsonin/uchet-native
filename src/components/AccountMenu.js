import React, {useContext} from 'react'
import {Text, View, StyleSheet} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import Context from "../context";

const unixConverter = unix => {

    const date = new Date(unix * 1000);
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    const year = date.getFullYear(); //full year in yyyy format
    return (day + '.' + month + '.' + year);

}

export const AccountMenu = props => {

    const {auth, app} = useContext(Context)

    let user = app.users.find(u => u.id === auth.user_id)

    return <View style={styles.view} >
        <Text style={styles.text}>
            {user
                ? user.name
                : 'Имя'}
        </Text>
        <Text style={styles.text}>
            {'Подписка до: ' + unixConverter(auth.exp)}
        </Text>
        <FontAwesome.Button
            style={styles.button}
            name={'sign-out'}
            backgroundColor={"#0c8098"}
            onPress={() => props.setInitialAuth()}
        >
            Выйти
        </FontAwesome.Button>
    </View>
}

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        zIndex: 2,
        right: 10,
        top: 10,
        backgroundColor: '#f8f8f8',
        width: '30%',
        alignSelf: 'flex-end',
        padding: 2,
    },
    button: {
        borderColor: '#9c9c9c',
        borderWidth: 1,
    },
    text: {
        textAlign: 'center',
        margin: 5
    }
})