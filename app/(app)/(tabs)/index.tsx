import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../../assets/images/logo.jpg";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    padding: 10,
  },
});

export default function Index() {
  const router = useRouter();
  const { user, initializing } = useAuth();

  if (initializing) return <ActivityIndicator size={"large"} />;

  if (!user) {
    router.replace("/login");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={logo}
          style={{
            height: 150,
            width: 150,
          }}
        />
        <Text>HOME SCREEN</Text>
        <Text>Edit app/index.tsx to edit this screen.</Text>
      </View>
    </SafeAreaView>
  );
}
