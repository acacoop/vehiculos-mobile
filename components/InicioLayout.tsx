import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import Navbar from './Navbar'

const InicioLayout = () => {
  return (
    <View style={styles.container}>
      <Text>Hola @user</Text >
      <Image source={require('../assets/Logo.svg')}  style={styles.image} />
      <View style={styles.Navbar}><Navbar/></View>
    </View>
  )
}

export default InicioLayout

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 50
    },
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 100,
    },
    Navbar: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    }
})