import { FlatList, Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Vehicle } from "../interfaces/vehicle";
import { getAllVehicles } from "../lib/vehicles";
import { VehicleCard } from "./VehicleCard";

export function Main() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    getAllVehicles().then((data) => setVehicles(data));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}> Vehiculos disponibles</Text>
      <FlatList
        data={vehicles}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  titulo:{
    color:'#000',
    fontSize: 20,
    textAlign: 'center',
    margin:20
  },

});
