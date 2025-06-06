import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(userPages)" options={{ headerShown: false }} />
      <Stack.Screen name="lists/[list]" options={{ headerShown: false }} />
    </Stack>
  );
}
