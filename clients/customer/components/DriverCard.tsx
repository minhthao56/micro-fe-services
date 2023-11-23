import { Card, Paragraph, H4, XStack, Button, Image } from "tamagui";
import React from "react";

export default function Driver() {
  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      width="100%"
      height={150}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
    >
      <Card.Header padded>
        <H4>Sony A7IV</H4>
        <Paragraph theme="alt2">Now available</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button borderRadius="$10">Purchase</Button>
      </Card.Footer>
    </Card>
  );
}
