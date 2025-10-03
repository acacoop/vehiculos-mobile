import { ScrollView, StyleSheet, Text, View } from "react-native";

interface ScheduleProps {
  from: Date;
  to: Date;
  licensePlate: string;
}

export function Schedule({ from, to, licensePlate }: ScheduleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>Desde</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {from.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </Text>
          <Text style={styles.text}>
            {from.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>Hasta</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {to.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </Text>
          <Text style={styles.text}>
            {to.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>Asignado</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text} numberOfLines={2}>
            Miguel Miguez
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemContainer: {
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#FE9000",
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "400",
    color: "#282D86",
    textAlign: "center",
  },
});
