import React, {useState} from 'react'
import {View, TextInput, Button, StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

const SERVER = 'https://uchet.store';
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

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginValid, setLoginValid] = useState(true);



    const loginButtonHandler = () => {
        // console.log(login, password)

        let r = /^\w+@\w+\.\w{2,5}$/i;
        let result = r.test(login);
        if (!result) {
            let number = +login;
            result = !(isNaN(number) || number < 999999 || number > 99999999999999)
        }

        setLoginValid(false)

        fetch(SERVER + '/api', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: "sign_in",
                phone_number: login,
                email: login,
                password
            })
        })
            .then(res => res.json())
            .then(res => {

                if (res.result) {
                    let jwt = res.JWT

                    try {
                        AsyncStorage.setItem('jwt', jwt)
                    } catch (e) {
                        console.log('AsyncStorage error ' + e)
                    }

                    let payload = parseJwt(jwt);
                    payload.jwt = jwt;
                    props.setAuth(payload);
                }



            })
            .catch(error => {
                console.error('Ошибка запроса: ', error)
                return {result: false}
            });


    }

    return <View style={styles.auth}>
        <TextInput style={styles.input}
                   placeholder={'Номер телефона или email'}
                   onChangeText={text => setLogin(text)}
                   value={login}
        />
        <TextInput style={styles.input}
                   placeholder={'Пароль'}
                   secureTextEntry
                   onChangeText={text => setPassword(text)}
                   value={password}
        />
        <Button title='Войти'
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