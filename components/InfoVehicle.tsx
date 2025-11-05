import React from "react";
import { View, Text, StyleSheet } from "react-native";

type InfoItem = {
  label: string;
  value?: string | number | null;
  fallback?: string;
};

export type InfoVehicleSection = {
  title: string;
  items: InfoItem[];
};

type InfoVehicleProps = {
  sections: InfoVehicleSection[];
  columns?: number;
};

const DEFAULT_FALLBACK = "No informado";

export function InfoVehicle({ sections, columns = 2 }: InfoVehicleProps) {
  const normalizedColumns = Math.max(columns, 1);

  return (
    <View style={styles.wrapper}>
      {sections.map((section) => {
        const rows = chunkItems(section.items, normalizedColumns);
        return (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.itemsContainer}>
              {rows.map((row, rowIndex) => (
                <View
                  key={`${section.title}-row-${rowIndex}`}
                  style={styles.row}
                >
                  {row.map((item) => (
                    <View
                      key={`${section.title}-${item.label}`}
                      style={[
                        styles.itemCard,
                        normalizedColumns > 1 ? styles.itemCardHalf : null,
                      ]}
                    >
                      <Text style={styles.label}>{item.label}</Text>
                      <Text style={styles.value}>
                        {formatValue(item.value, item.fallback)}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function formatValue(
  value: InfoItem["value"],
  fallback: InfoItem["fallback"],
): string {
  if (value === null || value === undefined || value === "") {
    return fallback ?? DEFAULT_FALLBACK;
  }
  return String(value);
}

function chunkItems<T>(items: T[], size: number): T[][] {
  if (size <= 1) return items.map((item) => [item]);
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    rowGap: 24,
  },
  section: {
    rowGap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#282D86",
  },
  itemsContainer: {
    rowGap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: 12,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
    gap: 6,
  },
  itemCardHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#282D86",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
