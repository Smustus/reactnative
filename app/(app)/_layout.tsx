import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="lists/[list]"
        options={({ route }) => {
          const { list } = route.params as { list: string };
          return {
            headerShown: true,
            headerTitle: decodeURIComponent(list.toLocaleUpperCase()),
          };
        }}
      />
    </Stack>
  );
}
