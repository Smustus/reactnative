import ProductForm from "@/components/ProductForm";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProductScreen = () => {
  const { listId, listName, id, name, retailer, price, ownerId } =
    useLocalSearchParams<{
      listId: string;
      listName: string;
      id: string;
      name: string;
      retailer: string;
      price: string;
      ownerId: string;
    }>();

  const productToEdit = {
    id,
    name,
    retailer,
    price: parseFloat(price),
    createdAt: new Date(),
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Edit Product" }} />
      <ProductForm
        listId={listId}
        listName={listName}
        ownerId={ownerId}
        productToEdit={productToEdit}
      />
    </SafeAreaView>
  );
};

export default EditProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
});
