import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { useSession } from "../ctx";
import { add } from "utils/add";
import { MyView } from "expo-shared-ui";
import { Activity, Airplay } from "@tamagui/lucide-icons";
import {  XGroup, XStack, YStack,Input, Button } from "tamagui";
import { FormsDemo } from "../../components/FormDemo";

export default function TabOneScreen() {
  const val = useSession();
  return (
    <>
    <FormsDemo size={"$zIndex.0"}/>
      <View style={styles.container}>
        <Text style={styles.title}>Tab One Customer App</Text>
        <Text style={styles.title}>{add(2, 3)}</Text>
        <MyView />
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text
          onPress={() => {
            val?.signOut();
          }}
        >
          Sign Out
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
