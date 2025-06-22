import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  const { user } = useAuth();
  const isLoggedIn = user !== null ? true : false;

  return (
    <AuthProvider>
      <Stack>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </AuthProvider>
  );
}
