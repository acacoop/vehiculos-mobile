import { Vehicle } from "../interfaces/vehicle";
import { Image, Text, View, StyleSheet } from "react-native";

type VehicleCardProps = { vehicle: Vehicle };
export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: vehicle.imgUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{vehicle.licensePlate}</Text>
        <Text style={styles.text}>{vehicle.brand}</Text>
        <Text style={styles.text}>{vehicle.model}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 50,
    flexDirection: 'row',
    alignItems: "center",
    gap: 10,
    width: 250,
    backgroundColor: "#f9f9f9", 
    padding: 10, 
    borderRadius: 8, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, 
    borderWidth: 0.2,
    borderColor: "BBBBBB",
    margin: 20
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    flexDirection: 'column',
    color: "#000",
    
  },
  text:{
    fontSize: 15
  }
});
