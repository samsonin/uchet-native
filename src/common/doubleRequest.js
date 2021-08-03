import {SERVER, NEW_SERVER} from '../constants';

export default function doubleRequest(url, data = {}) {

    const init = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    if (data) init.body = JSON.stringify(data);

    function fetchReg(server) {

        return fetch(server + '/' + url, init)
            .catch(error => {
                console.error('Ошибка запроса: ', error)
                return error
            })

    }

    return fetchReg(SERVER)
        .then(res => res.status > 299
            ? fetchReg(NEW_SERVER)
            : res
        )

}