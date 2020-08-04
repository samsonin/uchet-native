import React from "react";
import {ActivityIndicator, StyleSheet, View, Dimensions} from "react-native";


const left = Dimensions.get('window').width/2 - 18

const App = () => {

    return <View style={styles.container}>
        <ActivityIndicator size="large" color="#3c7a65"/>
    </View>

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '30%',
        left,
        zIndex: 2,
    },
});

export default App;