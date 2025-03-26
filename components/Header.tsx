import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
} from "react-native";

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
    width: "100%",
    backgroundColor: "#282D86",
  },
});

export default Header;
