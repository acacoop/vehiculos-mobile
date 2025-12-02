import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar
        backgroundColor="#000"
        barStyle="dark-content"
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
