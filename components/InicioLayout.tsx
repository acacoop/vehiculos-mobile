import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import Navbar from './Navbar'

const InicioLayout = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.user}>Hola @user</Text>
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
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 50,
        height: '100%',
        backgroundColor: '#ffffff',
    },
    ContainerImage: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 100,
    },
    Navbar: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 50,
    },
    user: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        paddingTop: 20,
    },
})