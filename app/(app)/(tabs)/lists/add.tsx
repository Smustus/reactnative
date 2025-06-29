import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddList = () => {
  const [listName, setListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddList = () => {
    setIsLoading(true);
    try {
    } catch (error) {
      console.log("Error creating list: " + error);
    } finally {
      setIsLoading(false);
      router.push(`/lists/${listName}`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Stack.Screen options={{ title: "Add List" }} />
        {!listName && (
          <View>
            <Stack.Screen options={{ title: "Add List" }} />

            <Text style={styles.label}>List Name</Text>
            <TextInput
              style={styles.input}
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
        {listName && (
          <View>
            <Stack.Screen options={{ title: "Add List" }} />

            <Text style={styles.label}>List Name</Text>
            <TextInput
              style={styles.input}
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
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "fff",
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
