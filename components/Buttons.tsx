import { StyleSheet, Pressable, Text, View } from "react-native";

type PressableButtonProps = {
  text: string;
  icon: (props: { pressed: boolean }) => React.JSX.Element;
  onPress: () => void;
};

export function PressableButton({ text, icon, onPress }: PressableButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? "#282D86" : "white" },
      ]}
      onPress={onPress}
    >
      {({ pressed }) => (
        <View style={styles.content}>
          {icon({ pressed })}
          <Text style={[styles.text, { color: pressed ? "white" : "black" }]}>
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 250,
    backgroundColor: "#f9f9f9",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
