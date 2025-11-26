import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    FlatList,
} from "react-native";
import { getVehicle } from "../../../services/vehicles";
import { useEffect, useState } from "react";
import { HistoryCard } from "../../../components/HistoryCard";

// Mock data for history - In a real app this would come from an API
const MOCK_HISTORY = [
    {
        id: "1",
        licensePlate: "BC-FG-34",
        date: "2024-07-24T08:15:00",
        status: "Aprobado",
        description: "Checklist Pre-viaje. Todos los ítems OK.",
    },
    {
        id: "2",
        licensePlate: "BC-FG-34",
        date: "2024-04-20T14:30:00",
        status: "Rechazado",
        description: "Falla en luces de freno traseras.",
    },
    {
        id: "3",
        licensePlate: "BC-FG-34",
        date: "2024-01-15T09:00:00",
        status: "Aprobado",
        description: "Control trimestral regular.",
    },
];

export default function ChecklistHistory() {
    // Updated to use licensePlate query param
    const { licensePlate } = useLocalSearchParams();

    const [vehicleDetail, setVehicleDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setLoading(true);
        // Fetch vehicle details
        getVehicle(licensePlate)
            .then((v) => {
                setVehicleDetail(v);
                // In a real implementation, we would also fetch the history here
                // setHistory(await getChecklistHistory(licensePlate));

                // Using mock data for now, filtering by license plate if needed, 
                // or just assigning the mock list
                const vehicleHistory = MOCK_HISTORY.map(item => ({ ...item, licensePlate: v?.licensePlate || licensePlate }));
                setHistory(vehicleHistory);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching vehicle", err);
                setError(err.message || "No se pudo cargar el vehículo");
                setVehicleDetail(null);
            })
            .finally(() => setLoading(false));
    }, [licensePlate]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#282D86" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: "Historial de Control",
                    headerTitleAlign: "center",
                }}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.licensePlateTitle}>
                        Dominio: {vehicleDetail?.licensePlate || licensePlate}
                    </Text>
                    <Text style={styles.subtitle}>
                        {vehicleDetail?.brand && vehicleDetail?.model
                            ? `${vehicleDetail.brand} ${vehicleDetail.model}`
                            : "Marca y modelo desconocidos"}
                    </Text>
                </View>

                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <HistoryCard item={item} />}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No hay registros de control para este vehículo.</Text>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#f5f5f5",
    },
    content: {
        flex: 1,
        alignItems: "center",
        width: "100%",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    },
    header: {
        width: "90%",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        gap: 8,
        shadowColor: "#00000012",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        marginTop: 20,
        marginBottom: 20,
    },
    licensePlateTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#282D86",
    },
    subtitle: {
        fontSize: 16,
        color: "#7A80A6",
    },
    listContainer: {
        width: "100%",

    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#666",
        fontSize: 16,
    }
});
