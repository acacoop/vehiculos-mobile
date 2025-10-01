import { Tabs } from "expo-router";
import {
  IconCar,
  IconSetting,
  IconHome,
  IconCalendar,
} from "../../components/Icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#282D86",
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: "#FE9000",
        tabBarInactiveTintColor: "#ffffff",
        headerStyle: {
          backgroundColor: "#282D86",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        },
        headerTitleAlign: "center",
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => <IconHome color={color} />,
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          tabBarLabel: "",
          headerTitle: "Vehículos",
          tabBarIcon: ({ color }) => <IconCar color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => <IconCalendar color={color} />,
        }}
      />

      <Tabs.Screen
        name="configuration"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => <IconSetting color={color} />,
        }}
      />
    </Tabs>
  );
}
