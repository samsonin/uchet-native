import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Button, ListViewComponent, StyleSheet, Text, View} from 'react-native';

import {Camera} from 'expo-camera';

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
import {Customer} from "./src/common/Customer";
import {Transit} from "./src/components/Transit";
import {Customers} from "./src/components/Customers";
import {Daily} from "./src/components/Daily";
import {BarCodeScanner} from "expo-barcode-scanner";
import {Good} from "./src/components/Good";
import {Orders} from "./src/components/Orders";
import {Consignments} from "./src/components/Consignments";

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
    const [isRequesting, setIsRequesting] = useState(false)
    const [good, setGood] = useState()

    const [hasPermission, setHasPermission] = useState(null);

    const setStockId = id => {

        setIsLeftMenuShow(false)

        setApp(prev => {

            let newApp = {...prev}

            newApp.stock_id = id

            return newApp

        })

    }

    const updApp = props => {

        console.log(props)

    }

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


    return auth
        ? < Context.Provider
            value={{
                setLoading,
                app,
                setStockId,
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
                                    : <BarCodeScanner
                                        // type="front"
                                        // onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                        onBarCodeScanned={handleBarCodeScanned}
                                        style={StyleSheet.absoluteFillObject}
                                    />
                                : contentId === 1
                                    ? <Orders/>
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
                                                    : contentId === 99
                                                        ? good && <Good good={good}/>
                                                        : emptyView('Раздел в разработке')
                            }

                            {isSubMenuVisible && !isBarcodeOpen && <SubMenu
                                id={subMenuId}
                                setContentId={setContentId}
                                setSubMenuVisible={setSubMenuVisible}
                            />}

                        </View>
                        {isBarcodeOpen && <Button style={styles.scannerCancelButton}
                                                  title='отмена'
                                                  onPress={() => setIsBarcodeOpen(false)}
                                                  color="red"
                        />}

                        <Bottom
                            setContentId={setContentId}
                            subMenu={subMenu}
                        />
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
    scannerCancelButton: {
        alignSelf: 'flex-end',
        marginBottom: 20
    },
    emptyView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '50%'
    },
})
