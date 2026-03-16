import { Link } from "expo-router";
import { Vehicle } from "../interfaces/vehicle";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Icon } from "./Icons";
import { colors } from "../constants/colors";

type VehicleCardProps = { vehicle: Vehicle };
export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${vehicle.licensePlate}`} asChild>
      <Pressable style={styles.touchable}>
        <View style={styles.card}>
          <View style={styles.containerImage}>
            <Icon name="car" size={40} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text1}>{vehicle.brand}</Text>
            <Text style={styles.text1}>{vehicle.model}</Text>
            <Text style={styles.text2}>{vehicle.licensePlate}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    width: "90%",
    alignSelf: "center",
    height: 120,
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 15,
    borderColor: colors.borderLight,
    borderWidth: 1,
    shadowColor: colors.shadowLight,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  text2: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textMuted,
  },
  text3: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
  },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.backgroundGray,
    borderRadius: "100%",
    marginLeft: 20,
  },
});
