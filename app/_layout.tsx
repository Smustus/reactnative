import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";

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
      <Stack.Screen name="(userPages)" options={{ headerShown: false }} />
      <Stack.Screen
        name="lists/[list]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
