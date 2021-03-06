import React, {useState} from 'react'
import {View, TextInput, Button, StyleSheet, Alert, Linking} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import rest from "../common/Rest";

import {LOGIN, PASS, RUSTAM, OLYA} from "@env"

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

                    // jwt = OLYA || jwt

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

                try {

                    let ws = new WebSocket('wss://appblog.ru:3333/' + jwt);

                    ws.onmessage = response => {

                        // console.log('onmessage')
                        // console.log(response);

                        // if (!response.isTrusted) return true;


                        let data = decodeURIComponent(response.data);

                        try {
                            data = JSON.parse(data);

                            if (typeof (data) !== "object") throw(console.error());

                            if (data.type === undefined) {

                                props.updApp(data);

                            } else if (data.type === "notification") {

                                console.log(data.text)

                            } else if (data.type === 'check_zp') {
                            } else if (data.type === 'testConnection') {
                                ws.send('test')
                            }

                        } catch {

                            console.log('error in json parse')

                        }


                    }

                    ws.onerror = (e) => {
                        // an error occurred
                        console.log('onerror')
                        console.log(e.message);
                    };

                    ws.onclose = (e) => {
                        // connection closed
                        // console.log('onclose')
                        // console.log(e.code, e.reason);

                    };

                } catch (e) {
                    console.error("ws " + e)
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
        <View style={styles.buttons}>
            <Button title='Войти'
                    disabled={props.isLoading || (!LOGIN && !isLoginValid)}
                    onPress={loginButtonHandler}
            />
            <Button title='Зарегистрироваться'
                    onPress={() => Linking.openURL('https://uchet.store')}
            />
        </View>
    </View>

}

const styles = StyleSheet.create({
    auth: {
        flex: 1,
        paddingTop: 150,
        paddingHorizontal: '14%',
        flexDirection: 'column',
    },
    input: {
        fontSize: 20,
        // width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'darkslateblue',
        marginVertical: 38,
    },
    buttons: {
        height: 120,
        justifyContent: 'space-around',
    }
})