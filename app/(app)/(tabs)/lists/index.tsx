import SearchBar from "@/components/SearchBar";
import { auth, db } from "@/firebase/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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

/* const savedLists = [
  { id: "firstlist", title: "My First List" },
  { id: "groceries", title: "Groceries" },
  { id: "work", title: "Work To-Dos" },
]; */

const Lists = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedLists, setSavedLists] = useState<any[]>([]);
  const [filteredLists, setFilteredLists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
    
    try {
      setIsLoading(true);
      async function fetchSavedLists() {
      const querySnapshot = await getDocs(
        collection(db, `users/${user?.uid}/lists`)
      );
      const lists = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSavedLists(lists);
    }
    fetchSavedLists();
    } catch (error) {
      console.log("Error fetching lists: " + error);
      Alert.alert("Could not retrieve lists from database")
    } finally {
      setIsLoading(false);
    }
    
  }, [router, user]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredLists(
        savedLists.filter((list) =>
          list.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    console.log(savedLists);
  }, [searchQuery, savedLists]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar
          placeholder="Search for a list"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.heading}>Saved Lists</Text>

        <Link
          href={"/lists/add"}
          style={[styles.button, { flexDirection: "row" }]}
          asChild
        >
          <TouchableOpacity>
            <Text style={[styles.buttonText, { marginRight: 3 }]}>Add</Text>
            <Ionicons name="add-circle-outline" size={24} />
          </TouchableOpacity>
        </Link>
        <View style={styles.listContainer}>
          {isLoading && <ActivityIndicator color={"blue"} />}
          {!isLoading && <FlatList
            style={{ width: "100%" }}
            data={searchQuery.length > 0 ? filteredLists : savedLists}
            renderItem={({ item }) => (
             
              <Link
                href={{
                  pathname: "/lists/[list]",
                  params: { list: item.name },
                }}
                style={styles.listItem}
                asChild
              >
                <TouchableOpacity /* style={styles.listItem} */>
                  <Text style={styles.listTitle}>
                    {item.name.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </Link>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No lists found</Text>
              </View>
            }
          />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Lists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    width: "100%",
  },
  listContainer: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "flex-start",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#999",
    width: "100%",
    marginTop: 5,
  },
  listItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    /*     alignSelf: "flex-start", */
    backgroundColor: "#999999",
    width: "100%",
    borderRadius: 15,
    padding: 10,
    marginVertical: 3,
    minHeight: 50,
  },
  listTitle: {
    fontSize: 16,
  },
  deleteBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    maxWidth: 40,
    height: 40,
    borderRadius: 50,
  },
  emptyContainer: {
    paddingTop: 20,
    alignItems: "center",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#888",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "lightblue",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
