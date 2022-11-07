import {createSlice} from "@reduxjs/toolkit";

const probableKeys = [
    'balance',
    'stock_id',
    'positions',
    'stocks',
    'users',
    'stockusers',
    'organization',
    'config',
    'fields',
    'docs',
    'entities',
    'providers',
    'categories',
    'order',
    'orders',
    'referals',
    'statuses',
    'queue',
    'daily',
    'transit',
]

const appSlice = createSlice({
    name: 'app',
    initialState: {},
    reducers: {
        updApp(state, action) {

            Object.keys(action.payload).map(k => {

                if (probableKeys.includes(k)) state[k] = action.payload[k]

            })

        }
    }
})

export const {updApp} = appSlice.actions

export default appSlice.reducer