import ConfirmationModal from "@/components/ConfirmationModal";
import Input from "@/components/Input";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/FirebaseConfig";
import { getUserByEmail, shareListWithUser } from "@/utils/firestore";
import { validateEmail } from "@/utils/validateEmail";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
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
  const { list, listId, ownerId } = useLocalSearchParams<{
    list: string;
    listId: string;
    ownerId: string;
  }>();
  const [productList, setProductList] = useState<any[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { user, initializing } = useAuth();
  const [shareEmail, setShareEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  useEffect(() => {
    /* const fetchUser = async () => {
      const targetUid = await getUserByEmail(shareEmail);
      console.log("Target: " + targetUid);
      return targetUid;
    };
    fetchUser();
    console.log("User: " + user?.uid);
    console.log("List id: " + listId); */
    /* console.log("Owner: " + ownerId); */
  }, [shareEmail, initializing, user, listId, ownerId]);

  const handleEmailChange = (text: string) => {
    setShareEmail(text);
    if (!validateEmail(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleDeleteList = async () => {
    if (initializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      setIsloading(true);
      await deleteDoc(doc(db, `users/${user.uid}/lists/${listId}`));
      Alert.alert("List successfully deleted");
      router.back();
    } catch (error) {
      console.log("Error deleting list: " + error);
    } finally {
      setIsloading(false);
      setModalVisible(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (initializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      setIsloading(true);
      const listRef = doc(db, `users/${user.uid}/lists/${listId}`);
      const listSnap = await getDoc(listRef);
      const data = listSnap.data();
      if (!data?.products) return;

      const updatedProducts = data.products.filter(
        (product: any) => product.id !== productId
      );
      await updateDoc(listRef, { products: updatedProducts });
      setProductList(updatedProducts);
    } catch (error) {
      console.log("Error deleting product: " + error);
    } finally {
      setIsloading(false);
    }
  };

  const handleShareList = async () => {
    if (initializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      setIsloading(true);
      const targetUid = await getUserByEmail(shareEmail);
      if (!targetUid) return Alert.alert("User doesn't exist");
      await shareListWithUser(user.uid, listId, targetUid);
      Alert.alert("List successfully shared!");
    } catch (error) {
      console.log("Error sharing list: " + error);
    } finally {
      setShareEmail("");
      setIsloading(false);
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
            doc(db, `users/${ownerId}/lists/${listId}`)
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
    }, [listId, initializing, router, user, ownerId])
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
        <Text>Purchase List</Text>
        <View style={styles.shareListContainer}>
          <Input
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={shareEmail}
            onChangeText={handleEmailChange}
            iconName="mail"
            error={emailError}
            containerStyle={styles.inputCompactContainer}
            inputStyle={styles.inputCompactText}
          />
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShareList}
            disabled={isLoading}
          >
            <Text style={styles.shareBtnText}>
              {isLoading ? "..." : "Share"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.addProductBtn}
            onPress={() =>
              router.push({
                pathname: "/lists/addProduct",
                params: { listId: listId, listName: list, ownerId: ownerId },
              })
            }
            disabled={isLoading}
          >
            <Text style={styles.addProductBtnText}>Add Product</Text>
          </TouchableOpacity>
          {ownerId === user?.uid && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => setModalVisible(true)}
              disabled={isLoading}
            >
              <Text style={styles.deleteBtnText}>
                {isLoading ? "Deleting..." : "Delete List"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.productContainer}>
          {!productList || productList?.length === 0 ? (
            <View style={styles.productList}>
              <Text style={styles.emptyText}>No products</Text>
            </View>
          ) : (
            <FlatList
              data={productList}
              contentContainerStyle={styles.productList}
              renderItem={({ item }) => (
                <ProductCard
                  item={item}
                  listId={listId}
                  listName={list}
                  ownerId={ownerId}
                  isLoading={isLoading}
                  handleDeleteProduct={handleDeleteProduct}
                />
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
  shareListContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 10,
    marginVertical: 12,
    width: "100%",
  },
  inputCompactContainer: {
    flex: 1,
    marginBottom: 0,
  },
  inputCompactText: {
    fontSize: 14,
    paddingVertical: 8,
  },
  shareBtn: {
    backgroundColor: "#1E90FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  shareBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
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

  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4d4f",
    maxHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    margin: 5,
  },
  deleteBtnText: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  addProductBtn: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    margin: 5,
  },
  addProductBtnText: {
    color: "blue",
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#888",
  },
});
