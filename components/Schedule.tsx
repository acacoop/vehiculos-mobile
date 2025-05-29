import { ScrollView, StyleSheet, Text, View } from "react-native";

interface ScheduleProps {
  from: Date;
  to: Date;
  licensePlate: string;
}

export function Schedule({ from, to, licensePlate }: ScheduleProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Desde</Text>
        <Text style={styles.text}> {from.toLocaleDateString()}</Text>
        <Text style={styles.text}>
          {" "}
          {from.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
      <View>
        <Text style={styles.title}>Hasta</Text>
        <Text style={styles.text}> {to.toLocaleDateString()}</Text>
        <Text style={styles.text}>
          {" "}
          {to.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
      <View>
        <Text style={styles.title}>Vehículo</Text>
        <Text style={styles.text}>{licensePlate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#282D86",
    height: 100,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FE9000",
    margin: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
    marginLeft: 10,
    fontWeight: "500",
  },
});
