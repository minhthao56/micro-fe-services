import React, { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";

export const KeyboardAvoidingComponent = (props: PropsWithChildren) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {props.children}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
