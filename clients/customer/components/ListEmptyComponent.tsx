import { View, Text, Spinner } from "tamagui";
import React from "react";

interface ListEmptyComponentProps {
  text: string;
  loading: boolean;
}

export function ListEmptyComponent({
  loading,
  text,
}: ListEmptyComponentProps) {
  if (loading) {
    return <Spinner />;
  }
  return <Text textAlign="center">{text}</Text>;
}
