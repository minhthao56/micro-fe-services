import { Text, Card, Separator, XStack, Avatar, YStack, Button } from 'tamagui'
import React from 'react'
import * as Linking from 'expo-linking';
import { PhoneOutgoing } from '@tamagui/lucide-icons';


// export interface CustomerCardProps {
//     customer: Customer;
// }

export default function CustomerCard() {
  return (
    <Card
    elevate
    bordered
    animation="bouncy"
    width="100%"
    height={115}
    scale={0.9}
    hoverStyle={{ scale: 0.925 }}
    pressStyle={{ scale: 0.875 }}
    py="$3"
    px="$4"
    mb="$2"
    flex={1}
  >
    <Text theme="alt1" fontSize="$1">
      Your customer is waiting for you!
    </Text>
    <Separator marginVertical={8} />
    <XStack alignItems="center">
      <Avatar circular size="$4">
        <Avatar.Image src="http://placekitten.com/200/300" />
        <Avatar.Fallback bc="red" />
      </Avatar>
      <YStack ml="$2" flex={1}>
        <Text >{`Nguyen Minh Thao`}</Text>
        <Text theme="alt1">{`1 KM`}</Text>
      </YStack>
      <Button
        icon={PhoneOutgoing}
        onPress={() => {
          Linking.openURL(`tel: 0123456789`);
        }}
        bg="$green8"
      >
        Call
      </Button>
    </XStack>
  </Card>
  )
}