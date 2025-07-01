import Input from "@/components/Input";
import { auth, db } from "@/firebase/FirebaseConfig";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddProduct = () => {
  const { listId, listName } = useLocalSearchParams<{
    listId: string;
    listName: string;
  }>();
  const [name, setName] = useState("");
  const [retailer, setRetailer] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user || !listId) return;

    try {
      await addDoc(
        collection(db, `users/${user.uid}/lists/${listId}/products`),
        {
          name,
          retailer,
          price: parseFloat(price),
          createdAt: new Date(),
        }
      );
      Alert.alert("Success", "Product added!");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add product.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Add Product" }} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Text style={styles.heading}>Add Product to {listName}</Text>

        <Input
          placeholder="Product Name"
          /* style={styles.input} */
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Retailer"
          /* style={styles.input} */
          value={retailer}
          onChangeText={setRetailer}
        />
        <Input
          placeholder="Price"
          keyboardType="decimal-pad"
          /* style={styles.input} */
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save to List</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "dodgerblue",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
