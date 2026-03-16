import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "../constants/colors";

export type CardRowItem = {
  label: string;
  value: string | number;
  /** Si es true, se aplica estilo destacado al valor */
  highlight?: boolean;
};

export type CardGridItem = {
  value: string | number;
  /** Si es true, se aplica estilo destacado al valor */
  highlight?: boolean;
  /** Si es true, el item ocupa todo el ancho */
  fullWidth?: boolean;
  /** Si es true, se aplica negrita al texto */
  bold?: boolean;
};

type CardProps = {
  /** Array de filas a mostrar con label y value */
  rows: CardRowItem[];
  /** Estilos personalizados para el contenedor */
  containerStyle?: ViewStyle;
  /** Estilos personalizados para las filas */
  rowStyle?: ViewStyle;
  /** Estilos personalizados para los labels */
  labelStyle?: TextStyle;
  /** Estilos personalizados para los valores */
  valueStyle?: TextStyle;
  /** Estilos personalizados para valores destacados */
  highlightStyle?: TextStyle;
};

type CardGridProps = {
  /** Array de items a mostrar en grid */
  items: CardGridItem[];
  /** Estilos personalizados para el contenedor */
  containerStyle?: ViewStyle;
  /** Estilos personalizados para los valores */
  valueStyle?: TextStyle;
  /** Estilos personalizados para valores destacados */
  highlightStyle?: TextStyle;
};

export function Card({
  rows,
  containerStyle,
  rowStyle,
  labelStyle,
  valueStyle,
  highlightStyle,
}: CardProps) {
  return (
    <View style={[styles.card, containerStyle]}>
      {rows.map((row, index) => (
        <View key={index} style={[styles.cardRow, rowStyle]}>
          <Text style={[styles.cardLabel, labelStyle]}>{row.label}</Text>
          <Text
            style={[
              row.highlight ? styles.cardValueHighlight : styles.cardValue,
              row.highlight ? highlightStyle : valueStyle,
            ]}
          >
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function CardGrid({
  items,
  containerStyle,
  valueStyle,
  highlightStyle,
}: CardGridProps) {
  return (
    <View style={[styles.card, containerStyle]}>
      <View style={styles.gridContainer}>
        {items.map((item, index) => (
          <View
            key={index}
            style={[styles.gridItem, item.fullWidth && styles.gridItemFull]}
          >
            <Text
              style={[
                item.highlight ? styles.gridValueHighlight : styles.gridValue,
                item.highlight ? highlightStyle : valueStyle,
                item.bold && { fontWeight: "700" },
              ]}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderColor: colors.borderLight,
    borderWidth: 1,
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  cardValueHighlight: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  // Grid styles
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 8,
    width: "100%",
  },
  gridItem: {},
  gridItemFull: {
    width: "100%",
  },
  gridValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  gridValueHighlight: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
});
