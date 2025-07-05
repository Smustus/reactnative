import ProductForm from "@/components/ProductForm";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddProduct = () => {
  const { listId, listName, ownerId } = useLocalSearchParams<{
    listId: string;
    listName: string;
    ownerId: string;
  }>();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Add Product" }} />
      <ProductForm listId={listId} listName={listName} ownerId={ownerId} />
    </SafeAreaView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
