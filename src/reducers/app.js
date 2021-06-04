import {UPD_APP} from "../constants";

const initialState = {
    balance: 0,
    stock_id: 0,
    stocks: [],
    users: [],
    organization: [],
    config: [],
    docs: [],
    fields: [],
    providers: [],
    categories: [],
}

// const getData = async () => {
//     try {
//         const jsonValue = await AsyncStorage.getItem('app')
//         return jsonValue != null ? JSON.parse(jsonValue) : null;
//     } catch(e) {
//         // error reading value
//     }
// }


const app = (state = initialState, action) => {

    if (action.type === UPD_APP) {

        let newState = {...state};

        if (typeof(action.data) === 'object') {
            Object.keys(action.data).map(k => {
                newState[k] = action.data[k]
            });
        }

        // window.localStorage.setItem('app', JSON.stringify(newState));
        return newState;

    } else {
        return state
    }

};

export default app;