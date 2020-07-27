import React, {useState, useRef} from 'react'
import {connect} from "react-redux";
import {View, TextInput, Button, StyleSheet} from 'react-native'
import {bindActionCreators} from "redux";
import {exit_app, init_user, upd_app} from "../actions/actionCreator";



function Auth(props){
    const {init_user} = props;

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginIsValid, setLoginIsValid] = useState(true);

    const loginButtonHandler = () => {
        console.log(login, password)

        let r = /^\w+@\w+\.\w{2,5}$/i;
        let result = r.test(login);
        if (!result) {
            let number = +login;
            result = !(isNaN(number) || number < 999999 || number > 99999999999999)
        }

        setLoginIsValid(false)

        let payload = {
            user_id: 4,
            organization_id: 1,
            admin:true,
            exp: 1609459200,
        }

        init_user('JWT', +payload.user_id, +payload.organization_id, payload.admin, payload.exp);

    }

    return <View style={styles.auth}>
        <TextInput style={styles.input}
                   placeholder={'email или Номер телефона'}
                   onChangeText={text => setLogin(text)}
                   value={login}
        >
            Password
        </TextInput>
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

const mapDispatchToProps = dispatch => bindActionCreators({
    init_user,
    upd_app,
    exit_app
}, dispatch);

export default connect(state => (state), mapDispatchToProps)(Auth)
