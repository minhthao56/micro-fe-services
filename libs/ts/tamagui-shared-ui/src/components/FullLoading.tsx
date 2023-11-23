import { YStack, Spinner } from "tamagui";

export function FullLoading() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Spinner />
    </YStack>
  );
}
