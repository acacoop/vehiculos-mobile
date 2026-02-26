import { Tabs } from "expo-router";
import { Icon } from "../../components/Icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#ffffff",
          paddingTop: 10,
          paddingBottom: 15,
          height: 90,
        },
        tabBarActiveTintColor: "#FE9000",
        tabBarInactiveTintColor: "#282D86",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTitleAlign: "center",
        headerTintColor: "#282D86",
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
