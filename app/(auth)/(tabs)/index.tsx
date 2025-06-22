import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
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
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Handle user state changes
  function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(handleAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Login</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text>Login</Text>
        </TouchableOpacity>

        <Image
          source={logo}
          style={{
            height: 150,
            width: 150,
          }}
        />
        <Text>Edit app/index.tsx to edit this screen.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
