import ConfirmationModal from "@/components/ConfirmationModal";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/FirebaseConfig";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PurchaseList = () => {
  const { list, id } = useLocalSearchParams<{ list: string; id: string }>();
  const [productList, setProductList] = useState<any[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { user, initializing } = useAuth();

  useEffect(() => {
    console.log("Products: " + productList);
  }, [productList]);

  const handleDeleteList = async () => {
    if (initializing) return;
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

  useFocusEffect(
    useCallback(() => {
      if (initializing) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      const fetchListProducts = async () => {
        try {
          setIsloading(true);
          const querySnapshot = await getDoc(
            doc(db, `users/${user.uid}/lists/${id}`)
          );
          if (!querySnapshot.exists()) return;
          const list = querySnapshot.data();
          setProductList(list.products);
        } catch (error) {
          console.log("Error fetching list items: " + error);
        } finally {
          setIsloading(false);
        }
      };
      fetchListProducts();
    }, [id, initializing, router, user])
  );

  if (initializing || isLoading)
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        size="large"
      />
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: list.toUpperCase() }} />

      <View style={styles.container}>
        <Text>PurchaseList</Text>
        <Text>{list}</Text>
        <View style={styles.btnContainer}>
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
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => setModalVisible(true)}
            disabled={isLoading}
          >
            <Text style={styles.deleteBtnText}>
              {isLoading ? "Deleting..." : "Delete List"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productContainer}>
          {!productList || productList?.length === 0 ? (
            <View style={styles.productList}>
              <Text>No products</Text>
            </View>
          ) : (
            <FlatList
              data={productList}
              contentContainerStyle={styles.productList}
              renderItem={({ item }) => (
                <View style={styles.productCard}>
                  <Text>{item.name}</Text>
                  <Text>{item.retailer}</Text>
                  <Text>{item.price} kr</Text>
                </View>
              )}
            />
          )}
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
    paddingHorizontal: 30,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  productContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  productList: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
    marginVertical: 5,
  },
  productCard: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4d4f",
    maxHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    margin: 5,
  },
  deleteBtnText: {
    fontWeight: "bold",
  },
  addProductBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
  },
  addProductBtnText: {
    color: "blue",
    fontWeight: "bold",
    textAlign: "center",
  },
});
