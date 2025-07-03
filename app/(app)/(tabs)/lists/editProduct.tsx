import ProductForm from "@/components/ProductForm";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const EditProductScreen = () => {
  const { listId, listName, id, name, retailer, price } = useLocalSearchParams<{
    listId: string;
    listName: string;
    id: string;
    name: string;
    retailer: string;
    price: string;
  }>();

  const productToEdit = {
    id,
    name,
    retailer,
    price: parseFloat(price),
    createdAt: new Date(), // Not used in form but needed by type
  };

  return (
    <View style={styles.container}>
      <ProductForm
        listId={listId}
        listName={listName}
        productToEdit={productToEdit}
      />
    </View>
  );
};

export default EditProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
});
