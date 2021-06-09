import React, {useState} from 'react'
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import rest from "../common/Rest";

import {LOGIN, PASS} from "@env"

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const atob = (input = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 === 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
         buffer = str.charAt(i++);

         ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
         bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        buffer = chars.indexOf(buffer);
    }

    return output;
}

const parseJwt = token => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    return JSON.parse(decodeURIComponent(atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')));
}

export const Auth = props => {

    const [login, setLogin] = useState(LOGIN || '');
    const [password, setPassword] = useState(PASS || '');
    const [isLoginValid, setLoginValid] = useState(false);

    const loginValidator = login => {

        login = login.trim()
        setLogin(login)

        let r = /^\w+@\w+\.\w{2,5}$/i;
        let result = r.test(login);
        if (!result) {
            let number = +login;
            result = !(isNaN(number) || number < 999999 || number > 99999999999999)
        }
        setLoginValid(result)
        return result;
    }

    const loginButtonHandler = () => {

        if (!loginValidator(login)) return

        props.setLoading(true)

        fetch('https://api.uchet.store/login', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone_number: login,
                email: login,
                password
            })
        })
            .then(res => res.text())
            .then(jwt => {

                try {

                    let payload = parseJwt(jwt);
                    payload.jwt = jwt;
                    props.setAuth(payload);

                    try {
                        AsyncStorage.setItem('jwt', jwt)
                            .then(() => {
                                rest('initial', 'GET')
                                    .then(res => {

                                        if (res.status === 200) {
                                            props.setApp(res.body)
                                        }

                                    })
                            })
                    } catch (e) {
                        console.log('AsyncStorage error ' + e)
                    }

                } catch (e) {
                    Alert.alert('Ошибка', 'Неправильный логин или пароль')
                }


            })
            .catch(error => {
                console.error('Ошибка запроса: ', error)
                return {result: false}
            })
            .finally(() => {
                props.setLoading(false)
            });

    }

    return <View style={styles.auth}>
        <TextInput style={styles.input}
                   placeholder={'Номер телефона или email'}
                   onChangeText={text => loginValidator(text)}
                   value={login}
                   disableFullscreenUI={props.isLoading}
        />
        <TextInput style={styles.input}
                   placeholder={'Пароль'}
                   secureTextEntry
                   onChangeText={text => setPassword(text)}
                   value={password}
        />
        <Button title='Войти'
                disabled={props.isLoading || (!LOGIN && !isLoginValid)}
                onPress={loginButtonHandler}
        />
    </View>

}

const styles = StyleSheet.create({
    auth: {
        paddingTop: 120,
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        fontSize: 20,
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'darkslateblue',
        margin: 20,
        // top: 25
    }

})