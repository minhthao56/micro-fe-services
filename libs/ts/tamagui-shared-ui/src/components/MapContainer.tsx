import React, { PropsWithChildren, forwardRef } from "react";
import MapView, { PROVIDER_GOOGLE, MapViewProps } from "react-native-maps";
import { Button, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, MapPin } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { View } from "react-native";

interface MapContainerProps extends Omit<MapViewProps, "provider" | "style"> {
  renderBottom?: () => React.ReactNode;
  renderRight?: () => React.ReactNode;
  showBackButton?: boolean;
  showFakePin?: boolean;
}

export const MapContainer = forwardRef<
  any,
  PropsWithChildren<MapContainerProps>
>((props, ref) => {
  const {
    children,
    renderBottom,
    showFakePin = true,
    showBackButton = true,
    renderRight,
    ...rest
  } = props;
  const insets = useSafeAreaInsets();

  return (
    <YStack flex={1}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        provider={PROVIDER_GOOGLE}
        mapType="terrain"
        {...rest}
        ref={ref}
      >
        {children}
      </MapView>
      {showBackButton ? (
        <Button
          onPress={() => {
            router.back();
          }}
          style={{
            marginTop: insets.top,
            position: "absolute",
          }}
          borderRadius="$10"
          w="$4"
          ml="$2"
          icon={ArrowLeft}
        />
      ) : null}

      {renderBottom && renderBottom()}
      {renderRight && renderRight()}
      <View
        style={{
          left: "50%",
          position: "absolute",
          top: "50%",
          marginLeft: -12,
          marginTop: -20,
        }}
      >
        {showFakePin ? <MapPin size={24} color="black" fill="black" /> : null}
      </View>
    </YStack>
  );
});
