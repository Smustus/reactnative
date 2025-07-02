// components/AddProductForm.tsx
import Input from "@/components/Input";
import { auth, db } from "@/firebase/FirebaseConfig";
import { useRouter } from "expo-router";
import { arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

interface ProductFormProps {
  listId: string;
  listName: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ listId, listName }) => {
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
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
    </KeyboardAvoidingView>
  );
};

export default ProductForm;

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
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
