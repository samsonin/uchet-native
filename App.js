import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {Button, ListViewComponent, StyleSheet, Text, View} from 'react-native';

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

export default function App() {

    const initialAuth = {
        user_id: 0,
        jwt: '',
        organization_id: 0,
        admin: false,
        expiration_time: 0,
    }

    const [auth, setAuth] = useState(initialAuth);
    const [app, setApp] = useState({})
    const [isLoading, setLoading] = useState(false);
    const [contentId, setContentId] = useState(0);
    const [isSubMenuVisible, setSubMenuVisible] = useState(false);
    const [subMenuId, setSubMenuId] = useState(0);
    const [isAccountMenuShow, setAccountMenuShow] = useState(false);
    const [isLeftMenuShow, setIsLeftMenuShow] = useState(false);
    const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false)
    const [good, setGood] = useState()

    const setStockId = id => {

        setApp(prev => {

            let newApp = {...prev}

            newApp.stock_id = id

            return newApp

        })

    }

    const accountMenuHandler = () => {
        setAccountMenuShow(!isAccountMenuShow)
    }

    const setInitialAuth = () => {
        setAccountMenuShow(false)
        setAuth(initialAuth)
        setApp({})
    }

    const leftMenuHandler = () => {

        setIsLeftMenuShow(!isLeftMenuShow)

    }

    const subMenu = menuId => {

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

        console.log(typeof type, type, data, isRequesting)

        rest('goods/' + data)
            .then(res => {

                setIsRequesting(false)

                if (res.status === 200) {

                    setContentId(99)
                    setGood(res.body)

                }

            })


    }

    return <Context.Provider value={{
        setLoading,
        app,
        setStockId,
        auth
    }}>
        <View style={styles.container}>
            <Header
                isAuth={auth.user_id > 0}
                leftMenuHandler={leftMenuHandler}
                accountMenuHandler={accountMenuHandler}
            />

            {isLoading && <ActivityIndicator/>}

            {auth.user_id > 0
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
                            ? <BarCodeScanner
                                // type="front"
                                // onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                onBarCodeScanned={handleBarCodeScanned}
                                style={StyleSheet.absoluteFillObject}
                            />
                            : contentId === 3
                                ? <Transit/>
                                : contentId === 5
                                    ? <Customers/>
                                    : contentId === 8
                                        ? <Daily/>
                                        : contentId === 99
                                            ? good && <Good good={good}/>
                                            : <Text>
                                                main content:
                                                {contentId}
                                            </Text>
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
                </>
                : <Auth auth={auth}
                        setAuth={setAuth}
                        setApp={setApp}
                        isLoading={isLoading}
                        setLoading={setLoading}
                />
            }

            {auth.user_id > 0
                ? <Bottom
                    setContentId={setContentId}
                    subMenu={subMenu}
                />
                : null}

            <StatusBar style="auto"/>
        </View>
    </Context.Provider>
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
    }
})
