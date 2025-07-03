import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[list]" options={{ headerShown: true }} />
      <Stack.Screen name="add" options={{ headerShown: true }} />
      <Stack.Screen name="addProduct" options={{ headerShown: true }} />
      <Stack.Screen name="editProduct" options={{ headerShown: true }} />
    </Stack>
  );
};

export default Layout;

/* const styles = StyleSheet.create({}); */
