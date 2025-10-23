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
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#FFFFFF",
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
    width: "100%",
    padding: 10,
    gap: 10,
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    shadowColor: "#0000006c",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#282D86",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
});
