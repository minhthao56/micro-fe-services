import { Card, CardProps } from "tamagui";
export function LocationCard(props: CardProps) {
  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      {...props}
    ></Card>
  );
}
