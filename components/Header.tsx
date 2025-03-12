import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Constants from 'expo-constants';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <StatusBar backgroundColor="#282D86" barStyle="light-content" />
            <Text style={styles.user}>Hola @user</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#282D86',
        borderBottomEndRadius: 50,
        borderBottomStartRadius: 50,
        padding: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        paddingTop: Constants.statusBarHeight, 
    },
    user: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
        paddingTop: 20,
    },
});

export default Header;
