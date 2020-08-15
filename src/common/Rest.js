import React from "react";
import AsyncStorage from '@react-native-community/async-storage';

const SERVER = 'https://api.uchet.store';
// const SERVER = 'http://127.0.0.1:8000';

let response = {};

export default function fetchPost(url, method = 'GET', data = '') {

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
        : false
    })
  // .finally(() => {
  //     console.log('finally AsyncStorage')
  // })

}
