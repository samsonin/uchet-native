import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {ListViewComponent, StyleSheet, Text, View} from 'react-native';

import Context from "./src/context";

import {Header} from './src/components/Header'
// import {MainContent} from './src/components/MainContent';
import {Bottom} from './src/components/Bottom';
import {Auth} from './src/components/Auth';
import {AccountMenu} from './src/components/AccountMenu'
import {SubMenu} from "./src/components/SubMenu";
import ActivityIndicator from './src/components/ActivityIndicator';
import {Customer} from "./src/common/Customer";
import {Customers} from "./src/components/Customers";

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
  const [isAccountMenuShow, setAccountMenuShow] = useState(false)

  const accountMenuHandler = () => {
    setAccountMenuShow(!isAccountMenuShow)
  }

  const setInitialAuth = () => {
    setAccountMenuShow(false)
    setAuth(initialAuth)
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

  return <Context.Provider value={{
    setLoading,
    app,
  }}>
    <View style={styles.container}>
      <Header
        isAuth={auth.user_id > 0}
        accountMenuHandler={accountMenuHandler}
      />

      {isLoading && <ActivityIndicator/>}

      {auth.user_id > 0
        ? <View style={styles.content}>
          {isAccountMenuShow
            ? <AccountMenu
              setInitialAuth={setInitialAuth}
            />
            : null}

          {contentId === 5
            // ? <Customer id={6601} />
            ? <Customers/>
            : <Text>
              main content
            </Text>
          }

          {isSubMenuVisible
            ? <SubMenu
              id={subMenuId}
              setContentId={setContentId}
              setSubMenuVisible={setSubMenuVisible}
            />
            : null}
        </View>
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
})
