import ProductForm from "@/components/ProductForm";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddProduct = () => {
  const { listId, listName } = useLocalSearchParams<{
    listId: string;
    listName: string;
  }>();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Add Product" }} />
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
    paddingHorizontal: 30,
  },
});
