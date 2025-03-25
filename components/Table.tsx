import { View, Text, FlatList, StyleSheet } from "react-native";

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
      renderItem={({ item, index }) => (
        <View
          style={[
            style.itemContainer,
            {
              backgroundColor: index % 2 === 0 ? "#E0E0E0" : "#FFFFFF",
            },
          ]}
        >
          <View
            style={{
              justifyContent: "center",
              alignContent: "flex-start",
              width: "50%",
            }}
          >
            <Text style={style.keyText}>{item.key} </Text>
          </View>
          <View>
            <Text style={style.valueText}>{item.value}</Text>
          </View>
        </View>
      )}
    />
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: 250,
    margin: 20,
    gap: 10,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  valueText: {
    fontSize: 16,
    color: "#000",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
});
