import React, {useEffect, useRef, useState} from 'react';
import {Button, PushNotificationIOS, ScrollView, StyleSheet, Text, ToastAndroid, View} from 'react-native';

import {Camera} from 'expo-camera';
import { Audio } from 'expo-av';

import Context from "./src/context";

import rest from "./src/common/Rest"

import {Header} from './src/components/Header'
// import {MainContent} from './src/components/MainContent';
import {Bottom} from './src/components/Bottom';
import {Auth} from './src/components/Auth';
import {AccountMenu} from './src/components/AccountMenu'
import {LeftMenu} from './src/components/LeftMenu'
import {SubMenu} from "./src/components/SubMenu";
import ActivityIndicator from './src/components/ActivityIndicator';
// import {Customer} from "./src/common/Customer";
import {Transit} from "./src/components/Transit";
import {Customers} from "./src/components/Customers";
import {Daily} from "./src/components/Daily";
import {Zp} from "./src/components/Zp";
import {BarCodeScanner} from "expo-barcode-scanner";
import {Good} from "./src/components/Good";
import {Orders} from "./src/components/Orders";
import {Order} from "./src/components/Order";
import {Consignments} from "./src/components/Consignments";
import RBSheet from "react-native-raw-bottom-sheet";

const sounds = [
    'success.wav',
    'warning.wav',
    'danger.wav',
]

const scanModes = [
    {name: 'выбрать режим...', mode: 'good'},
    // {name: 'транзит', mode: 'transit'},
    {name: 'инвентаризация', mode: 'inventory'},
]

export default function App() {

    const [auth, setAuth] = useState();
    const [app, setApp] = useState()
    const [isLoading, setLoading] = useState(false);
    const [contentId, setContentId] = useState(0);
    const [isSubMenuVisible, setSubMenuVisible] = useState(false);
    const [subMenuId, setSubMenuId] = useState(0);
    const [isAccountMenuShow, setAccountMenuShow] = useState(false);
    const [isLeftMenuShow, setIsLeftMenuShow] = useState(false);
    const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
    const [scanMode, setScanMode] = useState('good')
    const [isRequesting, setIsRequesting] = useState(false)
    const [good, setGood] = useState()
    const [currentOrder, setCurrentOrder] = useState()
    const [sound, setSound] = useState();


    const [hasPermission, setHasPermission] = useState(null);

    const refRBSheet = useRef();
    const inventoryBarcode = useRef()

    async function playSound(soundId) {

        console.log('Loading Sound');

        const { success } = await Audio.Sound.createAsync(
            require('./assets/sounds/success.wav')
        );
        const { warning } = await Audio.Sound.createAsync(
            require('./assets/sounds/warning.wav')
        );
        setSound(soundId ? warning : success);

        console.log('Playing Sound');
        await sound.playAsync(); }

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync(); }
            : undefined;
    }, [sound]);

    const setStockId = stock_id => {

        setIsLeftMenuShow(false)

        updApp({stock_id})

    }

    const notify = text => {

        if (Platform.OS === 'android') {

            ToastAndroid.show(text, 2)

        } else {

            // PushNotificationIOS.scheduleLocalNotification();

        }

    }

    const updApp = props => setApp(prev => {

        if (Object.keys(props)[0] === 'orders') {

            const next = {...prev}

            next.orders.map(o => {

                if (o.id === props.orders[0].id && o.stock_id === props.orders[0].stock_id) {

                    return props.orders[0]

                }

                return o

            })

        }

        return ({...prev, ...props})
    })

    const accountMenuHandler = () => {
        setAccountMenuShow(!isAccountMenuShow)
    }

    const setInitialAuth = () => {
        setAccountMenuShow(false)
        setAuth()
        setApp()
    }

    const leftMenuHandler = () => {

        setIsLeftMenuShow(!isLeftMenuShow)

    }

    const subMenu = menuId => {

        if (menuId === 3) setIsBarcodeOpen(true)

        if (isSubMenuVisible) {
            if (subMenuId === menuId) {
                setSubMenuVisible(false)
            } else {
                setSubMenuId(menuId)
            }
        } else {
            setSubMenuId(menuId)
            setSubMenuVisible(true)
        }

    }

    const handleBarCodeScanned = ({type, data}) => {

        if (scanMode === 'good') {

            setIsBarcodeOpen(false)
            setIsLeftMenuShow(false)

            if (isRequesting) return

            setIsRequesting(true)

            // if (type !== 32) return

            // console.log(typeof type, type, data, isRequesting)

            rest('goods/' + data)
                .then(res => {

                    setIsRequesting(false)

                    if (res.status === 200) {

                        setContentId(99)
                        setGood(res.body)

                    }

                })

        } else if (scanMode === 'inventory') {

            if (!app.stock_id) {
                return alert('выберите точку')
            }

            if (inventoryBarcode.current === data) return

            inventoryBarcode.current = data

            rest('inventory/' + app.stock_id + '/' + data, 'POST')
                .then(res => {
                    console.log(res)

                    if (res.status === 200){

                        playSound(0).then(r => notify('учтено ' + res.body.model))

                    } else if (res.status === 422) {

                        playSound(2).then(r => notify('error: ' + res.body.error))

                    }

                })

        }

    }

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync()
            setHasPermission(status === 'granted')
        })();
    }, []);

    const emptyView = text => <View style={styles.emptyView}>
        <Text>
            {text}
        </Text>
    </View>

    const openOrder = o => {

        setCurrentOrder(o)
        setContentId(11)

    }

    const closeOrder = () => {

        setCurrentOrder()
        setContentId(1)

    }

    const scanModeHandle = mode => {

        setScanMode(mode)
        refRBSheet.current.close()

        console.log(mode)

    }

    return auth
        ? < Context.Provider
            value={{
                setLoading,
                app,
                setStockId,
                updApp,
                auth
            }}>
            <View
                style={styles.container}>
                < Header
                    isAuth={auth.user_id > 0}
                    leftMenuHandler={leftMenuHandler}
                    accountMenuHandler={accountMenuHandler}
                />

                {app
                    ? <>
                        <View style={styles.content}>

                            {isLeftMenuShow && !isBarcodeOpen && <LeftMenu
                                close={() => setIsLeftMenuShow(false)}
                                setIsBarcodeOpen={setIsBarcodeOpen}
                            />}

                            {isAccountMenuShow && !isBarcodeOpen && <AccountMenu
                                setInitialAuth={setInitialAuth}
                            />}

                            {isBarcodeOpen
                                ? hasPermission === false
                                    ? emptyView('Нет доступа к камере')
                                    : <View style={styles.scanView}>
                                        <BarCodeScanner
                                            // type="front"
                                            // onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                            onBarCodeScanned={handleBarCodeScanned}
                                            // style={StyleSheet.absoluteFillObject}
                                            style={styles.scanner}
                                        />
                                        <Button style={styles.scannerButton}
                                                title='отмена'
                                                onPress={() => setIsBarcodeOpen(false)}
                                                color="red"
                                        />
                                        <Button style={styles.scannerButton}
                                                title={scanModes.find(m => m.mode === scanMode).name}
                                                onPress={() => refRBSheet.current.open()}
                                                color="blue"
                                        />
                                    </View>
                                : contentId === 1
                                    ? <Orders openOrder={openOrder}/>
                                    : contentId === 2
                                        ? app.stock_id
                                            ? <Consignments/>
                                            : emptyView('Выберите точку')
                                        : contentId === 3
                                            ? <Transit/>
                                            : contentId === 5
                                                ? <Customers/>
                                                : contentId === 8
                                                    ? <Daily/>
                                                    : contentId === 9
                                                        ? <Zp/>
                                                        : contentId === 11
                                                            ? <Order
                                                                currentOrder={currentOrder}
                                                                closeOrder={closeOrder}
                                                            />
                                                            : contentId === 99
                                                                ? good && <Good good={good} setGood={setGood}/>
                                                                : emptyView('Добро пожаловать!')
                            }

                            {isSubMenuVisible && !isBarcodeOpen && <SubMenu
                                id={subMenuId}
                                setContentId={setContentId}
                                setSubMenuVisible={setSubMenuVisible}
                            />}

                        </View>

                        <Bottom
                            setContentId={setContentId}
                            subMenu={subMenu}
                        />

                        <RBSheet
                            ref={refRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={200}
                        >
                            <ScrollView>
                                {scanModes.map(b => <Button
                                    color="#999"
                                    key={'customerviewreferalsbuttonsk' + b.mode}
                                    style={styles.scrollButton}
                                    title={b.name}
                                    onPress={() => scanModeHandle(b.mode)}
                                />)}
                            </ScrollView>
                        </RBSheet>

                    </>
                    : <ActivityIndicator/>}

            </View>
        </Context.Provider>
        : <Auth auth={auth}
                setAuth={setAuth}
                setApp={setApp}
                updApp={updApp}
                isLoading={isLoading}
                setLoading={setLoading}
        />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    content: {
        padding: 4,
        backgroundColor: 'rgba(255,246,16,0.34)',
        height: '80%',
    },
    scanView: {
        justifyContent: 'space-between',
    },
    scanner: {
        height: '80%',
    },
    scannerButton: {
        // alignSelf: 'flex-end',
        margin: 40,
        height: '10%',

    },
    emptyView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '50%'
    },
})