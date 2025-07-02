import ProductForm from "@/components/ProductForm";
import { auth, db } from "@/firebase/FirebaseConfig";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet
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

    if (!name.trim() || !retailer.trim() || !price.trim()) {
      Alert.alert("Fill all fields please");
      return;
    }

    try {
      const id = doc(collection(db, "tmp")).id;
      await updateDoc(doc(db, `users/${user.uid}/lists/${listId}`), {
        products: arrayUnion({
          id,
          name,
          retailer,
          price: parseFloat(price),
          createdAt: new Date(),
        }),
      });
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add product.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Add Product" }} />
      {/* <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Text style={styles.heading}>Add Product to {listName}</Text>

        <Input
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Retailer"
          value={retailer}
          onChangeText={setRetailer}
        />
        <Input
          placeholder="Price"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save to List</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView> */}
      {listId && listName && (
        <ProductForm listId={listId} listName={listName} />
      )}
    </SafeAreaView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
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
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "dodgerblue",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
