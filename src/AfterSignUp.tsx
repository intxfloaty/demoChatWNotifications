import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner } from 'tamagui';

const AfterSignUp = ({ navigation }) => {

    // initially playerDetails is an empty object, as usePlayerDetails is an async func, it takes some time to fetch details
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            console.log("Home")
            navigation.navigate("Home")
        }, 2000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <View
            style={styles.overlay}
        >
            <Spinner size="large" color="blue.500" />
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
});

export default AfterSignUp;
