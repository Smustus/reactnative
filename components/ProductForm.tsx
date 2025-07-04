import Input from "@/components/Input";
import { auth, db } from "@/firebase/FirebaseConfig";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface Product {
  id: string;
  name: string;
  retailer: string;
  price: number;
  createdAt: Date;
}

interface ProductFormProps {
  listId: string;
  listName: string;
  ownerId: string;
  productToEdit?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({
  listId,
  listName,
  ownerId,
  productToEdit,
}) => {
  const [name, setName] = useState(productToEdit?.name || "");
  const [retailer, setRetailer] = useState(productToEdit?.retailer || "");
  const [price, setPrice] = useState(productToEdit?.price.toString() || "");
  const router = useRouter();

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user || !listId) return;

    if (!name.trim() || !retailer.trim() || !price.trim()) {
      Alert.alert("Fill all fields please");
      return;
    }

    try {
      const listRef = doc(db, `users/${ownerId}/lists/${listId}`);
      const listSnap = await getDoc(listRef);
      const data = listSnap.data();
      console.log(data);

      if (!data) return;

      let updatedProducts;

      if (productToEdit) {
        // Editing
        updatedProducts = data.products.map((product: Product) =>
          product.id === productToEdit.id
            ? {
                ...product,
                name,
                retailer,
                price: parseFloat(price),
              }
            : product
        );
      } else {
        // Adding new
        const id = doc(collection(db, "tmp")).id;
        const newProduct: Product = {
          id,
          name,
          retailer,
          price: parseFloat(price),
          createdAt: new Date(),
        };
        updatedProducts = [...(data.products ?? ""), newProduct];
      }

      await updateDoc(listRef, { products: updatedProducts });
      router.back();
    } catch (error) {
      console.log("Failed to add product: " + error);
      Alert.alert("Error", "Failed to add product.");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <Text style={styles.heading}>
        {productToEdit ? "Edit" : "Add"} Product to {listName}
      </Text>

      <Input placeholder="Product Name" value={name} onChangeText={setName} />
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

      <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
        <Text style={styles.saveBtnText}>
          {productToEdit ? "Save Change" : "Save to List"}
        </Text>
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
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  saveBtnText: {
    color: "white",
    fontWeight: "bold",
  },
});
