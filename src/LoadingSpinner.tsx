import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner } from 'tamagui';

const LoadingSpinner = () => {
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
});

export default LoadingSpinner;
