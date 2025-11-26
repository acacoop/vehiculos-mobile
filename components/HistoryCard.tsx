import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Icon } from "./Icons";
import { useRouter } from "expo-router";

// Assuming a type for the checklist history item. 
// Adjust fields based on actual data structure if needed.
type ChecklistHistoryItem = {
    id: string;
    licensePlate: string;
    date: string; // e.g., "2024-07-24T08:15:00" or similar
    status: "Aprobado" | "Rechazado" | "Pendiente"; // Example statuses
    description: string;
};

type HistoryCardProps = {
    item: ChecklistHistoryItem;
};

export function HistoryCard({ item }: HistoryCardProps) {
    const router = useRouter();

    // Helper to format date
    const formatDate = (dateString: string) => {
        // This is a basic formatter, might need adjustment based on input format
        // and desired output "24 de Julio, 2024 - 08:15"
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(date).replace(',', ' -');
        } catch (e) {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'aprobado': return '#28a745'; // Green
            case 'rechazado': return '#dc3545'; // Red
            default: return '#ffc107'; // Yellow/Orange
        }
    };

    return (
        <Pressable
            style={styles.container}
            onPress={() => router.push(`/vehicles/checklist/${item.licensePlate}`)}
        >
            <View style={styles.header}>
                <Text style={styles.licensePlate}>Patente: {item.licensePlate}</Text>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
            </View>

            <Text style={styles.date}>{formatDate(item.date)}</Text>

            <View style={styles.divider} />

            <Text style={styles.description}>{item.description}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        width: '100%'
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    licensePlate: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 14,
        fontWeight: "600",
    },
    date: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: "#666",
    },
});
