import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVER, NEW_SERVER} from '../constants'
import {parseJwt} from '../components/Auth'

let response = {};

export default function fetchPost(url, method = 'GET', data = '') {

    return AsyncStorage.getItem('jwt')
        .then(jwt => {

            const payload = parseJwt(jwt)

            return payload && payload.organization_id
                ? fetch((payload.organization_id < 1001 ? SERVER : NEW_SERVER) + '/' + url, {
                        method,
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + jwt
                        },
                        body: data
                            ? JSON.stringify(data)
                            : null
                    }
                )
                    .then(res => {
                        response = {
                            status: res.status,
                            ok: res.ok
                        };
                        return res;
                    })
                    .then(res => res.json())
                    .then(res => {
                        response.body = res;
                        return response;
                    })
                    .catch(error => {
                        if (!response.ok) response.error = error;
                        return response;
                    })
                : false
        })
    // .finally(() => {
    //     console.log('finally AsyncStorage')
    // })

}
