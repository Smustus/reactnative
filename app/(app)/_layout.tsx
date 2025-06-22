import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" /* options={{ headerShown: false }} */ />
      <Stack.Screen
        name="lists/[list]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
