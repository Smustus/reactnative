import Input from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth();

  const handleAddList = async () => {
    if (!listName.trim()) {
      Alert.alert("Validation", "List name is required.");
      return;
    }

    setIsLoading(true);
    setListInfo((prevValue) => ({ ...prevValue, listName }));
    try {
      if (!user || !auth.currentUser) {
        router.replace("/login");
        return null;
      }

      const data = await addDoc(collection(db, `users/${user?.uid}/lists`), {
        name: listName.trim(),
        createdAt: serverTimestamp(),
        ownerId: user?.uid,
        sharedWith: [],
      });
      console.log("Added list: " + data.id);

      setListName("");
      router.replace({
        pathname: "/lists/[list]",
        params: { list: listName, id: data.id },
      });
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
          style={styles.saveBtn}
        >
          <Text style={styles.saveBtnText}>Save List</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  loading: {
    marginTop: 10,
  },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  saveBtnText: {
    fontWeight: "bold",
  },
});
