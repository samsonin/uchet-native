import {useState, useEffect, ActivityIndicator} from "react";
import AsyncStorage from '@react-native-community/async-storage';

const SERVER = 'https://api.uchet.store';

let response = {};
let isLoading = false;

export default function fetchPost(url, method = 'GET', data = '') {

    // if (isLoading) <ActivityIndicator/>

    return AsyncStorage.getItem('jwt')
        .then(jwt => {
                isLoading = true;

                return (typeof jwt === "string")
                    ? fetch(SERVER + '/' + url, {
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
                        .finally(() => isLoading = false)
                    : false
            }
        )

}
