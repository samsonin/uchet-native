import React, {useState} from 'react'
import {View, TextInput, Button, StyleSheet, Linking} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import rest from "../common/Rest";

import Toast from 'react-native-root-toast';

import {LOGIN, PASS, TEST_LOGIN, TEST_PASS, RUSTAM, OLYA} from "@env"

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

    const [login, setLogin] = useState(() => LOGIN || '');
    const [password, setPassword] = useState(() => PASS || '');
    const [password2, setPassword2] = useState();
    const [isLoginValid, setLoginValid] = useState(false);
    const [isRestoreTry, setIsRestoreTry] = useState(false);
    const [isHaveCode, setIsHaveCode] = useState(false);
    const [code, setCode] = useState();

    function regFetch(url, body) {

        return fetch('https://api.uchet.store/' + url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })

    }

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

    const loginButtonHandler = (needValid = true) => {

        if (needValid && !loginValidator(login)) return

        regFetch('login', {
            phone_number: login,
            email: needValid ? login : TEST_LOGIN,
            password: needValid ? password : TEST_PASS
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
                    Toast.show('Неправильный логин или пароль')
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

    const confirmPassButtonHandler = () => {

        if (isHaveCode) {

            if (password !== password2) {
                return Toast.show('passwords different')
            }

            regFetch('restore', {
                login,
                code,
                password
            })
                .then(res => {

                    if (res.status === 200) {

                        Toast.show('ок, пароль изменен')

                        setIsRestoreTry(false)
                        setIsHaveCode(false)

                    } else {

                        Toast.show('ошибка: ' + res.body)

                    }

                })

        } else {

            regFetch('codes', {login})
                .then(res => {

                    if (res.status === 200) {
                        setIsHaveCode(true)
                    } else {
                        Toast.show('неправильный логин')
                    }

                })

        }


    }

    return <View style={styles.auth}>
        {!isRestoreTry && <TextInput style={styles.input}
                                     placeholder={'Номер телефона или email'}
                                     onChangeText={text => loginValidator(text)}
                                     value={login}
                                     disableFullscreenUI={props.isLoading}
        />}
        {isRestoreTry && isHaveCode && <TextInput style={styles.input}
                                                  placeholder={'Код из сообщения'}
                                                  onChangeText={text => setCode(text)}
                                                  value={code}
        />}
        {!isRestoreTry || (isHaveCode && isRestoreTry)
            ? <TextInput style={styles.input}
                         placeholder={'Пароль'}
                         secureTextEntry
                         onChangeText={text => setPassword(text)}
                         value={password}
            />
            : null}
        {isRestoreTry && isHaveCode && <TextInput style={styles.input}
                                                  placeholder={'Подтвердите пароль'}
                                                  secureTextEntry
                                                  onChangeText={text => setPassword2(text)}
                                                  value={password2}
        />}
        <View style={styles.buttons}>
            {isRestoreTry
                ? <>
                    <Button title={isHaveCode
                        ? 'Подтвердить'
                        : 'Запросить код'}
                            onPress={confirmPassButtonHandler}
                    />
                    <Button title={isHaveCode ? 'Нет кода' : 'Есть код'}
                            onPress={() => setIsHaveCode(!isHaveCode)}
                    />
                    <Button title='Назад'
                            onPress={() => setIsRestoreTry(false)}
                    />
                </>
                : <>
                    <Button title='Войти'
                            disabled={props.isLoading || (!LOGIN && !isLoginValid)}
                            onPress={loginButtonHandler}
                    />
                    <Button title='Забыли пароль?'
                            disabled={props.isLoading || (!LOGIN && !isLoginValid)}
                            onPress={() => setIsRestoreTry(true)}
                    />
                    <Button title='Зарегистрироваться'
                            onPress={() => Linking.openURL('https://uchet.store')}
                    />
                    <Button title='Тестировать'
                            onPress={() => loginButtonHandler(false)}
                    />
                </>}
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
        borderBottomWidth: 1,
        borderBottomColor: 'darkslateblue',
        marginVertical: 38,
    },
    buttons: {
        height: '30%',
        justifyContent: 'space-around',
    },
})