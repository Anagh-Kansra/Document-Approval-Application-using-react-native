import React from 'react';
import {Text, View, StyleSheet, Animated } from 'react-native';

const LoadingComponent = () => {
    const progress = new Animated.Value(0);

    Animated.loop(
        Animated.timing(progress, {
            toValue: 1,
            //duration: 200,
            useNativeDriver: false
        })
    ).start();

    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={styles.loaderContainer}>
        <Text>Loading...</Text>
            <View style={styles.loaderWrapper}>
                <Animated.View style={[styles.loader, { width }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loaderWrapper: {
        width: 200, // Width of the loader container
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center' // Center the loader horizontally
    },
    loader: {
        height: '100%',
        backgroundColor: '#4CAF50',
        position: 'absolute',
        left: 0,
        top: 0,
    }
});

export default LoadingComponent;