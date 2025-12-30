import { StyleSheet, Pressable, Text, View } from "react-native";

type PressableButtonProps = {
  text: string;
  icon: (props: { pressed: boolean }) => React.JSX.Element;
  onPress: () => void | Promise<void>;
};

export function PressableButton({ text, icon, onPress }: PressableButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? "#FFF" : "#FE9000" },
      ]}
      onPress={onPress}
    >
      {({ pressed }) => (
        <View style={styles.content}>
          {icon({ pressed })}
          <Text style={[styles.text, { color: pressed ? "#FE9000" : "#fff" }]}>
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
    fontWeight: "600",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#00000070",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: "#ddd",
    borderWidth: 1,
    width: "90%",
    color: "#ffff",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
