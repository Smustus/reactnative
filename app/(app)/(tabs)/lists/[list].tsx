/* import ConfirmationModal from "@/components/ConfirmationModal";
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
import React, { useCallback, useState } from "react";
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
      return null;
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
      return null;
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
    paddingHorizontal: 20,
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
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  addProductBtnText: {
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 15,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#888",
  },
});
 */

import ConfirmationModal from "@/components/ConfirmationModal";
import Input from "@/components/Input"; // Assuming a custom Input component
import ProductCard from "@/components/ProductCard"; // Assuming a custom ProductCard component
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/FirebaseConfig";
import { getUserByEmail, shareListWithUser } from "@/utils/firestore";
import { validateEmail } from "@/utils/validateEmail";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useCallback, useState } from "react";
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
  const [isLoading, setIsLoading] = useState<boolean>(false); // Renamed for consistency
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { user, initializing } = useAuth();
  const [shareEmail, setShareEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  // Handler for email input change
  const handleEmailChange = (text: string) => {
    setShareEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Handle list deletion
  const handleDeleteList = async () => {
    if (initializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      setIsLoading(true);
      await deleteDoc(doc(db, `users/${user.uid}/lists/${listId}`));
      Alert.alert("Success", "List successfully deleted."); // More user-friendly message
      router.back();
    } catch (error) {
      console.log("Error deleting list: " + error);
      Alert.alert("Error", "Could not delete list. Please try again.");
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  // Handle product deletion from the list
  const handleDeleteProduct = async (productId: string) => {
    if (initializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      setIsLoading(true);
      const listRef = doc(db, `users/${ownerId}/lists/${listId}`); // Use ownerId to reference the list correctly
      const listSnap = await getDoc(listRef);
      const data = listSnap.data();

      if (!data?.products) {
        Alert.alert("Error", "No products found in this list.");
        return;
      }

      const updatedProducts = data.products.filter(
        (product: any) => product.id !== productId
      );
      await updateDoc(listRef, { products: updatedProducts });
      setProductList(updatedProducts); // Update local state
      Alert.alert("Success", "Product removed from list.");
    } catch (error) {
      console.log("Error deleting product: " + error);
      Alert.alert("Error", "Could not remove product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sharing list with another user
  const handleShareList = async () => {
    if (initializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!validateEmail(shareEmail)) {
      setEmailError("Please enter a valid email address to share.");
      return;
    }
    if (user.email === shareEmail) {
      setEmailError("You cannot share a list with yourself.");
      return;
    }

    try {
      setIsLoading(true);
      const targetUid = await getUserByEmail(shareEmail);
      if (!targetUid) {
        Alert.alert("User Not Found", "No user found with that email address.");
        return;
      }
      await shareListWithUser(user.uid, listId, targetUid);
      Alert.alert("Success", `List successfully shared with ${shareEmail}!`);
    } catch (error) {
      console.log("Error sharing list: " + error);
      Alert.alert("Error", "Could not share list. Please try again.");
    } finally {
      setShareEmail("");
      setEmailError("");
      setIsLoading(false);
    }
  };

  // Fetch list products on tabfocus
  useFocusEffect(
    useCallback(() => {
      if (initializing) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      const fetchListProducts = async () => {
        try {
          setIsLoading(true);
          const listRef = doc(db, `users/${ownerId}/lists/${listId}`);
          const querySnapshot = await getDoc(listRef);
          if (!querySnapshot.exists()) {
            Alert.alert(
              "List Not Found",
              "This list does not exist or has been deleted."
            );
            router.back();
            return;
          }
          const listData = querySnapshot.data();
          setProductList(listData?.products || []);
        } catch (error) {
          console.log("Error fetching list items: " + error);
          Alert.alert("Error", "Could not retrieve list items from database.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchListProducts();
    }, [listId, initializing, router, user, ownerId])
  );

  if (initializing || isLoading)
    return (
      <View style={styles.fullScreenLoading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: list?.toUpperCase() || "Shopping List",
          headerShown: true,
          headerTitleStyle: styles.stackHeaderTitle,
          headerStyle: styles.stackHeader,
        }}
      />

      <View style={styles.container}>
        {/* Share List Section */}
        <View style={styles.shareListSection}>
          <Text style={styles.sectionTitle}>Share List</Text>
          <View style={styles.shareInputContainer}>
            <Input
              placeholder="Enter email to share with"
              keyboardType="email-address"
              autoCapitalize="none"
              value={shareEmail}
              onChangeText={handleEmailChange}
              iconName="mail"
              error={emailError}
              containerStyle={styles.shareInputWrapper}
            />
            <TouchableOpacity
              style={[styles.shareBtn, isLoading && { opacity: 0.7 }]}
              onPress={handleShareList}
              disabled={
                isLoading ||
                !validateEmail(shareEmail) ||
                user?.email === shareEmail
              }
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.shareBtnText}>Share</Text>
              )}
            </TouchableOpacity>
          </View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.addProductBtn, isLoading && { opacity: 0.7 }]}
            onPress={() =>
              router.push({
                pathname: "/lists/addProduct",
                params: { listId: listId, listName: list, ownerId: ownerId },
              })
            }
            disabled={isLoading}
          >
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.addProductBtnText}>Add Product</Text>
          </TouchableOpacity>

          {ownerId === user?.uid && ( // Only show delete for the owner
            <TouchableOpacity
              style={[styles.deleteListBtn, isLoading && { opacity: 0.7 }]}
              onPress={() => setModalVisible(true)}
              disabled={isLoading}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.deleteListBtnText}>Delete List</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Product List Section */}
        <View style={styles.productListSection}>
          <Text style={styles.sectionTitle}>Products</Text>
          {productList?.length === 0 ? (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyText}>
                No products added to this list yet.
              </Text>
              <Text style={styles.emptyText}>
                Tap Add Product to get started!
              </Text>
            </View>
          ) : (
            <FlatList
              data={productList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flatListContentContainer}
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
        message={`Are you sure you want to delete the list "${list}"? This action cannot be undone.`}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  stackHeader: {
    backgroundColor: "#F2F2F7",
  },
  stackHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 5,
  },

  // Share List Section
  shareListSection: {
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 0,
  },
  shareInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  shareInputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  shareBtn: {
    backgroundColor: "#007AFF", // Accent color for share button
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10, // Rounded corners
    height: 48, // Fixed height to align with input
    justifyContent: "center",
    alignItems: "center",
  },
  shareBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: "#FF3B30", // Red for error messages
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
  },

  // Action Buttons Section
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  addProductBtn: {
    flexDirection: "row",
    alignItems: "center",
    /* backgroundColor: "#FFFFFF", */
    paddingVertical: 12,
    paddingHorizontal: 18,
    /* shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2, */
    flex: 1,
    justifyContent: "center",
  },
  addProductBtnText: {
    color: "#007AFF", // Accent color
    fontWeight: "600",
    marginLeft: 8, // Space between icon and text
    fontSize: 16,
  },
  deleteListBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    flex: 1, // Allow buttons to expand
    marginLeft: 10, // Space between buttons
    justifyContent: "center", // Center content horizontally
  },
  deleteListBtnText: {
    color: "#FF3B30", // Red for delete action
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },

  // Product List Section
  productListSection: {
    flex: 1, // Allow product list to take remaining space
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  flatListContentContainer: {
    paddingVertical: 5, // Padding for items inside the FlatList
  },
  emptyListContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 5,
  },

  // ProductCard (Assuming these styles are passed to ProductCard or defined there)
  // These are conceptual, as ProductCard's internal styling isn't shown here.
  // Ideally, ProductCard would also follow the card-like, clean aesthetic.
  // productCardItem: {
  //   backgroundColor: '#F9F9F9',
  //   borderRadius: 8,
  //   padding: 15,
  //   marginVertical: 5,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   borderWidth: StyleSheet.hairlineWidth,
  //   borderColor: '#E0E0E0',
  // },
  // productCardText: {
  //   fontSize: 16,
  //   color: '#333',
  // },
  // productCardDeleteBtn: {
  //   padding: 8,
  //   borderRadius: 20,
  //   backgroundColor: '#FFEBEE', // Light red background for delete icon
  // },
});
