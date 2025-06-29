import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

function RootLayoutContent() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <ActivityIndicator />;
  }

  const isAuthenticated = !!user; // true if user object exists, false otherwise

  return (
    <Stack>
      {/* Protected routes: Only accessible if authenticated */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Auth routes: Only accessible if NOT authenticated */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
