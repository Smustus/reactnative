import { auth } from "@/firebase/FirebaseConfig";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
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

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(auth.currentUser);

  // Handle user state changes
  function handleAuthStateChanged(user: User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

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
