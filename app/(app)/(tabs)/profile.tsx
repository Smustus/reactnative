import { auth } from "@/firebase/FirebaseConfig";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Profile</Text>
        <Link href={"/"} onPress={() => auth.signOut()} asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Logout</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    fontSize: 15,
    padding: 2,
    fontWeight: "bold",
    textAlign: "center",
    color: "blue",
  },
});
