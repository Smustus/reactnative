import ConfirmationModal from "@/components/ConfirmationModal";
import { auth, db } from "@/firebase/FirebaseConfig";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PurchaseList = () => {
  const { list, id } = useLocalSearchParams<{ list: string; id: string }>();
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleDeleteList = async () => {
    const user = auth.currentUser;
    if (!user) {
      router.replace("/login");
      return;
    }
    try {
      setIsloading(true);
      await deleteDoc(doc(db, `users/${user.uid}/lists/${id}`));
      Alert.alert("List successfully deleted");
      router.back();
    } catch (error) {
      console.log("Error deleting list: " + error);
    } finally {
      setIsloading(false);
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: list.toUpperCase() }} />

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => setModalVisible(true)}
          disabled={isLoading}
        >
          <Text style={styles.deleteBtnText}>
            {isLoading ? "Deleting..." : "Delete"}
          </Text>
        </TouchableOpacity>

        <Text>PurchaseList</Text>
        <Text>{list}</Text>
        <View style={styles.productContainer}>
          {productList?.length === 0 ? (
            <Text>No products</Text>
          ) : (
            <Text>Products</Text>
          )}
          <TouchableOpacity
            style={styles.addProductBtn}
            onPress={() =>
              router.push({
                pathname: "/lists/addProduct",
                params: { listId: id, listName: list },
              })
            }
            disabled={isLoading}
          >
            <Text style={styles.addProductBtnText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmationModal
        visible={modalVisible}
        message={`Do you really want to delete the list "${list}"? This cannot be undone.`}
        onConfirm={handleDeleteList}
        onCancel={() => setModalVisible(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </SafeAreaView>
  );
};

export default PurchaseList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  productContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  deleteBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4d4f",
    maxHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50,
    margin: 5,
  },
  deleteBtnText: {
    fontWeight: "bold",
  },
  addProductBtn: {
    padding: 10,
    margin: 5,
  },
  addProductBtnText: {
    color: "blue",
    fontWeight: "bold",
    textAlign: "center",
  },
});
