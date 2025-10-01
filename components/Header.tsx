import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
} from "react-native";
import Constants from "expo-constants";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar
        backgroundColor="#282D86"
        barStyle="light-content"
        translucent={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#282D86",
    borderRadius: 10,
  },
});

export default Header;
