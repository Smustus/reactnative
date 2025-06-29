import Input from "@/components/Input";
import { auth, db } from "@/firebase/FirebaseConfig";
import { Stack, useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface List {
  listName: string;
  items: string[];
}

const AddList = () => {
  const [listName, setListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [listInfo, setListInfo] = useState<List>({
    listName: "",
    items: [],
  });
  const router = useRouter();
  const user = auth.currentUser;

  const handleAddList = async () => {
    if (!listName.trim()) {
      Alert.alert("Validation", "List name is required.");
      return;
    }

    setIsLoading(true);
    setListInfo((prevValue) => ({ ...prevValue, listName }));
    try {
      if (!user) {
        router.replace("/login");
      }

      await addDoc(collection(db, `users/${user?.uid}/lists`), {
        name: listName.trim(),
        createdAt: serverTimestamp(),
      });

      setListName("");
      Alert.alert("Success", "List created successfully.");
      router.push(`/lists/${listName}`);
    } catch (error) {
      console.log("Error creating list: " + error);
      Alert.alert("Error", "Something went wrong. Try again.");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Stack.Screen options={{ title: "Add List" }} />
        {!listInfo.listName && (
          <View>
            <Stack.Screen options={{ title: "Add List" }} />

            <Text style={styles.label}>List Name</Text>
            <Input
              value={listName}
              onChangeText={setListName}
              placeholder="Enter your list name"
            />

            {isLoading && (
              <ActivityIndicator
                size="small"
                color="blue"
                style={styles.loading}
              />
            )}
          </View>
        )}
        {listInfo.listName && (
          <View>
            <Stack.Screen options={{ title: "Add List" }} />

            <Text style={styles.label}>List Name</Text>
            <Input
              value={listName}
              onChangeText={setListName}
              placeholder="Enter your list name"
            />

            {isLoading && (
              <ActivityIndicator
                size="small"
                color="blue"
                style={styles.loading}
              />
            )}
          </View>
        )}

        <TouchableOpacity
          disabled={isLoading}
          onPress={handleAddList}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Save List</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  loading: {
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "lightblue",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
