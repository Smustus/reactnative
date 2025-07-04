import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductCardProps {
  item: any;
  listId: string;
  listName: string;
  ownerId: string;
  isLoading: boolean;
  handleDeleteProduct: (id: string) => void;
  handleEditProduct?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  listId,
  listName,
  ownerId,
  isLoading,
  handleDeleteProduct,
}) => {
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();
  const { user, initializing } = useAuth();

  const handleEditProduct = async () => {
    console.log(ownerId);

    if (initializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.push({
      pathname: "/lists/editProduct",
      params: {
        listId,
        listName,
        id: item.id,
        ownerId,
        name: item.name,
        retailer: item.retailer,
        price: item.price.toString(),
      },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.productCard, isFinished && styles.finishedCard]}
      onPress={() => setIsFinished((prev) => !prev)}
      activeOpacity={0.8}
    >
      <View style={styles.infoContainer}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Product</Text>
          <Text style={[styles.value, isFinished && styles.strikethrough]}>
            {item.name}
          </Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Store</Text>
          <Text style={[styles.value, isFinished && styles.strikethrough]}>
            {item.retailer}
          </Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Price</Text>
          <Text style={[styles.value, isFinished && styles.strikethrough]}>
            {item.price} kr
          </Text>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => handleEditProduct()}
          disabled={isLoading}
        >
          <Ionicons name="pencil-outline" size={18} color="#fff" />
        </TouchableOpacity>
        {ownerId === user?.uid &&
          (isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteProduct(item.id)}
              disabled={isLoading}
            >
              <Ionicons name={"trash-outline"} size={18} color="#fff" />
            </TouchableOpacity>
          ))}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  finishedCard: {
    opacity: 0.6,
  },
  infoContainer: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    width: "20%",
  },
  infoBlock: {
    alignItems: "flex-start",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0099ff",
    maxHeight: 50,
    padding: 10,
    borderRadius: 12,
  },
  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4d4f",
    maxHeight: 50,
    padding: 10,
    borderRadius: 12,
    marginLeft: 10,
  },
});
