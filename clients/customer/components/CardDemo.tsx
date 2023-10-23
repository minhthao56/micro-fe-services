import { Card, CardProps, XStack } from "tamagui";
export function CardDemo() {
  return (
    <XStack $sm={{ flexDirection: "column" }} paddingHorizontal="$4" space>
      <DemoCard
        animation="bouncy"
        size="$4"
        height={300}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
      />
      <DemoCard
        animation="bouncy"
        size="$4"
        height={300}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
      />
      <DemoCard
        animation="bouncy"
        size="$4"
        height={300}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
      />
    </XStack>
  );
}
export function DemoCard(props: CardProps) {
  return <Card elevate size="$4" bordered {...props}></Card>;
}
