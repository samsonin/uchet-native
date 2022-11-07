import React, {useState} from 'react'
import {updApp} from "../store/appSlice";
import {View, Button, StyleSheet, Text, TextInput, ScrollView} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';

import {LOGIN, PASS, RUSTAM, OLYA} from "@env"
import {TEST_LOGIN, TEST_PASS} from '../constants'

import rest from "../common/Rest";
import doubleRequest from "../common/doubleRequest";
import License from "./License";
import Privacy from "./Privacy";
import {useDispatch} from "react-redux";

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

export const parseJwt = token => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    return JSON.parse(decodeURIComponent(atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')));
}

export const Auth = props => {

    // signIn, preRestore, restore, preRegister, register, privacy, license
    const [status, setStatus] = useState('signIn')

    const [name, setName] = useState('')
    const [login, setLogin] = useState(LOGIN || '');
    const [password, setPassword] = useState(PASS || '');
    const [password2, setPassword2] = useState('')
    const [code, setCode] = useState('')

    const dispatch = useDispatch()

    const isLoginValid = login => {

        const r = /^\w+@\w+\.\w{2,5}$/i;
        const n = +login;

        return (r.test(login) || !(isNaN(n) || n < 999999 || n > 99999999999999))

    }

    const init = jwt => {

        try {

            // jwt = OLYA || jwt

            let payload = parseJwt(jwt);
            payload.jwt = jwt;
            props.setAuth(payload);

            try {
                AsyncStorage.setItem('jwt', jwt)
                    .then(() => {
                        rest('initial', 'GET')
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

                        dispatch(updApp(data))

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

    }

    const signIn = (isDemo = false) => {

        doubleRequest('login', {
            login: isDemo ? TEST_LOGIN : login,
            password: isDemo ? TEST_PASS : password
        })
            .then(res => res.text())
            .then(res => {
                try {
                    init(res)
                } catch (e) {
                    Toast.show('Неправильный логин или пароль')
                }
            })

    }

    const pre = nextStatus => isLoginValid(login)
        ? setStatus(nextStatus)
        : Toast.show('Неправильный номер телефона или email')

    const sendRestoreCode = () => {

        doubleRequest('codes', {login})
            .then(res => res.status === 200
                ? setStatus('restore')
                : Toast.show('Неправильный номер телефона или email'))

    }

    const sendRegisterCode = () => {

        rest('codes/register', 'POST', {login})
            .then(res => res.status === 200
                ? setStatus('register')
                : Toast.show('ошибка: ' + res.body.error))

    }

    const confirm = (successText) => {

        if (password !== password2) return Toast.show('Пароли не совпадают')

        doubleRequest(status, {
            name,
            login,
            code,
            password
        })
            .then(res => res.text())
            .then(res => {

                if (res.status === 200) {

                    Toast.show(successText)

                    init(res)

                    return setStatus('signIn')

                }

                Toast.show('ошибка: ' + JSON.parse(res).error)

            })

    }

    const renderField = n => {

        if (n === 'privacy') return <View
            style={styles.privacy}
            key={'fieldkeyinloginmodal' + n}
        >
            <Text>
                Нажимая "Запросить код регистрации", вы принимаете
            </Text>
            <Text
                style={styles.span}
                onPress={() => setStatus('license')}
            >
                Пользовательское соглашение
            </Text>
            <Text>
                и даете согласие на
            </Text>
            <Text
                style={styles.span}
                onPress={() => setStatus('privacy')}
            >
                обработку персональных данных
            </Text>
        </View>

        const fields = {
            name: {l: 'Ваше имя', a: text => setName(text), v: name},
            password: {l: 'Пароль', a: text => setPassword(text), v: password},
            password2: {l: 'Повторить пароль', a: text => setPassword2(text), v: password2},
            code: {l: 'Код из сообщения', a: text => setCode(text), v: code},
        }

        return n === 'login'
            ? <TextInput style={styles.input}
                         key={'fieldkeyinloginmodal' + n}
                         id="login"
                         autoFocus={true}
                         placeholder={'Номер телефона или email'}
                         onChangeText={text => setLogin(text)}
                         value={login}
                         error={!isLoginValid(login)}
                         disabled={status !== 'signIn'}
            />
            : <TextInput style={styles.input}
                         key={'fieldkeyinloginmodal' + n}
                         id={n}
                         secureTextEntry={n.length > 7}
                         placeholder={fields[n].l}
                         value={fields[n].v}
                         onChangeText={fields[n].a}
            />

    }

    const colors = ['black', 'blue', 'red']

    const buttons = {
        signIn: {a: () => signIn(), color: 1, text: 'Вход'},
        back: {a: () => setStatus('signIn'), color: 2, text: 'Назад'},
        preRestore: {a: () => pre('preRestore'), color: 2, text: 'Забыли пароль?'},
        restore: {a: () => sendRestoreCode(), color: 1, text: 'Запросить код восстановления'},
        restoreConfirm: {a: () => confirm('Пароль изменен!'), color: 1, text: 'Подтвердить'},
        preRegister: {a: () => pre('preRegister'), color: 1, text: 'Регистрация'},
        register: {a: () => sendRegisterCode('register'), color: 1, text: 'Запросить код регистрации'},
        registerConfirm: {
            a: () => confirm('Поздравляем, Вы зарегистрированны!'), color: 1,
            text: 'Зарегистрироваться'
        },
        demo: {a: () => signIn(true), color: 0, text: 'Демо'},
    }

    const renderButton = name => <Button
        key={'buttonskeyinauth' + name}
        title={buttons[name].text}
        onPress={buttons[name].a}
        color={colors[buttons[name].color]}
    />

    const statuses = {
        signIn: {
            fields: ['login', 'password'],
            buttons: ['signIn', 'preRestore', 'preRegister', 'demo'],
        },
        preRestore: {
            fields: ['login'],
            buttons: ['back', 'restore']
        },
        restore: {
            fields: ['password', 'password2', 'code'],
            buttons: ['back', 'restoreConfirm']
        },
        preRegister: {
            fields: ['name', 'password', 'password2', 'privacy'],
            buttons: ['back', 'register',]
        },
        register: {
            fields: ['name', 'code'],
            buttons: ['back', 'registerConfirm']
        },
        privacy: {
            fields: [<Privacy/>],
            buttons: ['back', 'preRegister']
        },
        license: {
            fields: [<License/>],
            buttons: ['back', 'preRegister']
        },
    }


    return <View style={styles.auth}>

        {statuses[status].fields.map(f => typeof f === 'string' ? renderField(f) : f)}

        <View style={styles.buttons}>
            {statuses[status].buttons.map(b => renderButton(b))}
        </View>

    </View>

}

const styles = StyleSheet.create({
    auth: {
        flex: 1,
        paddingTop: 70,
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
    privacy: {
        margin: 1
    },
    span: {
        color: 'blue'
    }
})