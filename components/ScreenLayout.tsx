import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { Stack } from "expo-router";
import { colors } from "../constants/colors";

interface ScreenLayoutProps {
  title: string;
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  title,
  loading = false,
  error = null,
  children,
}) => {
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return <>{children}</>;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: title,
          headerTitleAlign: "center",
        }}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.white,
  },
  errorText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
