import { auth, db } from "@/firebase/FirebaseConfig";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PurchaseList = () => {
  const { list } = useLocalSearchParams<{ list: string }>();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const router = useRouter();

    const handleDeleteList =  async () => {
    const user = auth.currentUser;
    if(!user){
      router.replace("/login")
      return
    }
    try {
      setIsloading(true);
      await deleteDoc(doc(db, `users/${user.uid}/lists/${list}`))
      Alert.alert("List successfully deleted");
      router.back();
    } catch (error) {
      console.log("Error deleting list: " + error);
    } finally {
      setIsloading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: list.toUpperCase() }} />
      
      <View style={styles.container}>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteList} disabled={isLoading}>
            {isLoading ? <Text style={styles.deleteBtnText}>Deleting...</Text>
         : (<><Text style={styles.deleteBtnText}>Delete</Text>
            {/* <Ionicons name="remove" size={24}/> */}</>)}
          </TouchableOpacity>

        <Text>PurchaseList</Text>
        <Text>{list}</Text>
      </View>
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
  deleteBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    maxHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50,
  },
  deleteBtnText: {
    fontWeight: "bold",
  }
});
