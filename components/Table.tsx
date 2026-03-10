import { View, Text, FlatList, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export function Table({ data }: { data: any }) {
  const tableData = Object.entries(data).map(([key, value]) => ({
    key,
    value: String(value),
  }));

  return (
    <FlatList
      style={style.container}
      data={tableData}
      keyExtractor={(item) => item.key}
      scrollEnabled={false}
      renderItem={({ item, index }) => (
        <View
          style={[
            style.itemContainer,
            {
              backgroundColor: index % 2 === 0 ? colors.backgroundLight : colors.white,
            },
          ]}
        >
          <View>
            <Text numberOfLines={1} style={style.keyText}>
              {item.key}{" "}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text numberOfLines={1} style={style.valueText}>
              {item.value}
            </Text>
          </View>
        </View>
      )}
    />
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    padding: 10,
    gap: 2,
    borderRadius: 20,
    borderColor: colors.borderDark,
    borderWidth: 1,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDarkAlt,
    textAlign: "right",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
});
