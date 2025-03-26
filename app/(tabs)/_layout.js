import { Tabs } from "expo-router";
import { IconCar, IconSetting, IconCalendar } from "../../components/Icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#282D86" },
        tabBarActiveTintColor: "#FE9000",
      }}
    >
      <Tabs.Screen
        name="vehicles"
        options={{
          tabBarLabel: "Vehículos",
          tabBarIcon: ({ color }) => <IconCar color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Calendario",
          tabBarIcon: ({ color }) => <IconCalendar color={color} />,
        }}
      />
      <Tabs.Screen
        name="configuration"
        options={{
          tabBarLabel: "Configuración",
          tabBarIcon: ({ color }) => <IconSetting color={color} />,
        }}
      />
    </Tabs>
  );
}
