import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../../components/Icons";
import { colors } from "../../constants/colors";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.white,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 10),
          height: 60 + Math.max(insets.bottom, 10),
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.primary,
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleAlign: "center",
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          tabBarLabel: "Vehículos",
          headerTitle: "Vehículos",
          tabBarIcon: ({ color }) => (
            <Icon name="car" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarLabel: "Calendario",
          tabBarIcon: ({ color }) => (
            <Icon name="calendar" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="configuration"
        options={{
          tabBarLabel: "Configuración",
          tabBarIcon: ({ color }) => (
            <Icon name="setting" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
