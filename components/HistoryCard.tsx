import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { colors } from "../constants/colors";
import type { ChecklistHistoryItem } from "../interfaces/checklists";

type HistoryCardProps = {
  item: ChecklistHistoryItem;
};

// Quarter labels for display
const QUARTER_LABELS: Record<number, string> = {
  1: "Q1",
  2: "Q2",
  3: "Q3",
  4: "Q4",
};

export function HistoryCard({ item }: HistoryCardProps) {
  const router = useRouter();

  // Format the filled date (exact date when completed)
  const formatFilledDate = (dateString: string | null) => {
    if (!dateString) return "No completado";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Format quarter and year for display
  const formatQuarterYear = (quarter: number, year: number) => {
    return `${QUARTER_LABELS[quarter] || `Q${quarter}`} ${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprobado":
        return colors.success;
      case "rechazado":
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status.toLowerCase()) {
      case "rechazado":
        return "Con observaciones";
      default:
        return status;
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/vehicles/checklist/${item.id}`)}
    >
      <View style={styles.header}>
        <Text style={styles.statusLabel}>Estado</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusDisplayText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.label}>Período</Text>
        <Text style={styles.value}>
          {formatQuarterYear(item.quarter, item.year)}
        </Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.label}>Completado por</Text>
        <Text style={styles.user}>{item.filledBy || "Sin asignar"}</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.label}>Fecha de completado</Text>
        <Text style={styles.value}>{formatFilledDate(item.filledAt)}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.description}>{item.description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
    width: "100%",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: colors.gray[500],
    fontWeight: "500",
  },
  user: {
    fontSize: 14,
    color: colors.gray[500],
    fontWeight: "600",
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
