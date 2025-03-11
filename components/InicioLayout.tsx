import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import Navbar from './Navbar'
import Constants from 'expo-constants'

const InicioLayout = () => {
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Text style={styles.user}>Hola @user</Text>
      </View>
      <View style={styles.ContainerImage}>
        <Image source={require('../assets/Logo.svg')}  style={styles.image} />
      </View>
      <View style={styles.Navbar}><Navbar/></View>
    </View>
  )
}

export default InicioLayout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingTop: Constants.statusBarHeight,
    },
    ContainerImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    image: {
        width: 300,
        height: 100,
        backgroundColor: 'black',
    },
    Navbar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#282D86',
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        padding: 30,
    },
    user: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
        paddingTop: 20,
    },
})