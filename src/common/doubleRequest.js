import {SERVER, NEW_SERVER} from '../constants';

export default function doubleRequest(data = {}, url = "") {

    let init = {
        method: 'POST',
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        },
    }

    if (data) init.body = JSON.stringify(data);

    function fetchReg(server) {

        return fetch(server + '/' + url, init)
            .catch(error => {
                // console.error('Ошибка запроса: ', error)
                // return {result: false}
            })

    }

    return fetchReg(SERVER)
        .then(res => res.status > 299
            ? fetchReg(NEW_SERVER)
            : res
        )

}