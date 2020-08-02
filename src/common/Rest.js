import React, {useRef} from "react";
import AsyncStorage from '@react-native-community/async-storage';

const SERVER = 'https://api.uchet.store';

let response = {};

export default function fetchPost(url, method = 'GET', data = '') {

    // const activityIndicator = React.forwardRef('activityIndicator')

    // console.log('progress', activityIndicator)

    return AsyncStorage.getItem('jwt')
        .then(jwt => {

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
                        .finally(() => {
                            // if (progress) progress.style.display = 'none'
                        })
                    : false
            }
        )

}
