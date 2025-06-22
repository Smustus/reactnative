import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  const TabIcon = ({ focused, size, color, name }: TabIconProps) => {
    return (
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={size}
        color={color}
      />
    );
  };

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="lists/[list]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
