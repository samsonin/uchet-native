import React, {useContext, useRef} from 'react';
import {Button, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {Ionicons} from '@expo/vector-icons';

import Context from "../context";


export const StocksSelect = props => {

    const {auth, app, setStockId} = useContext(Context)

    const refRBSheet = useRef();

    const allowedStocks = app.stockusers
        ? app.stockusers
            .filter(su => su.user_id === auth.user_id)
            .map(su => app.stocks.find(s => s.id === su.stock_id))
        : []

    if (allowedStocks.length === 1 && allowedStocks[0].id !== app.stock_id) {
        setStockId(allowedStocks[0].id)
    }

    const scrollButtonHandler = stock_id => {

        refRBSheet.current.close()
        setStockId(stock_id)

    }

    return app.stock_id
        ? <View style={{
            flexDirection: 'row',
            padding: 3,
            justifyContent: 'space-around',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 8
        }}>
            <Text>
                {app.stocks.find(s => s.id === app.stock_id).name}
            </Text>
            <TouchableOpacity style={{
                margin: 8
            }}
                              onPress={() => setStockId()}
            >
                <Ionicons name="exit-outline" size={24} color="black"/>
            </TouchableOpacity>
        </View>
        : <><Button
            title={'выбрать точку...'}
            onPress={() => refRBSheet.current.open()}
            disabled={!!app.stock_id}
        />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={200}
            >
                <ScrollView>
                    {allowedStocks.map(s => <Button
                        color="#999"
                        key={'customerviewreferalsbuttonsk' + s.id}
                        style={styles.scrollButton}
                        title={s.name}
                        onPress={() => scrollButtonHandler(s.id)}
                    />)}
                </ScrollView>
            </RBSheet>
        </>

}

const styles = StyleSheet.create({
    // scrollButton: {
    //     color: '#234234'
    // }
})