import React, {useContext, useRef} from 'react';
import {Button, ScrollView, StyleSheet, Text} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

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

    const scrollButtonHandler = id => {

        refRBSheet.current.close()
        setStockId(id)

    }

    return app.stocks
        ? <>
            <Button
                slyle={props.st}
                title={app.stock_id
                    ? app.stocks.find(s => s.id === app.stock_id).name
                    : 'выбрать точку...'}
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
        : <Text>Загрузка...</Text>

}

const styles = StyleSheet.create({
    scrollButton: {
        color: '#234234'
    }
})