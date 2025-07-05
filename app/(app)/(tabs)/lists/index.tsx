/* import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/FirebaseConfig";
import { fetchAccessibleLists } from "@/utils/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
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

const Lists = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedLists, setSavedLists] = useState<any[]>([]);
  const [filteredLists, setFilteredLists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user, initializing } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (initializing) return;
      if (!user || !auth.currentUser) {
        router.replace("/login");
      }

      const fetchLists = async () => {
        try {
          setIsLoading(true);
          const lists = await fetchAccessibleLists(user!.uid);
          setSavedLists(lists);
        } catch (error) {
          console.log("Error fetching lists: " + error);
          Alert.alert("Could not retrieve lists from database");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLists();

      return () => {};
    }, [user, initializing, router])
  );

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredLists(
        savedLists.filter((list) =>
          list.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
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
          style={[styles.addBtn, { flexDirection: "row" }]}
          asChild
        >
          <TouchableOpacity>
            <Text style={[styles.addBtnText, { marginRight: 3 }]}>Add</Text>
            <Ionicons name="add-circle-outline" size={24} />
          </TouchableOpacity>
        </Link>
        <View style={styles.listContainer}>
          {isLoading && (
            <ActivityIndicator
              color={"blue"}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            />
          )}
          {!isLoading && (
            <FlatList
              style={{ width: "100%" }}
              data={searchQuery.length > 0 ? filteredLists : savedLists}
              renderItem={({ item }) => (
                <Link
                  href={{
                    pathname: "/lists/[list]",
                    params: {
                      list: item.name,
                      listId: item.id,
                      ownerId: item.ownerId,
                    },
                  }}
                  style={styles.listItem}
                  asChild
                >
                  <TouchableOpacity>
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
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Lists;

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
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
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#999999",
    width: "100%",
    borderRadius: 6,
    padding: 10,
    marginVertical: 3,
    minHeight: 70,
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
  addBtn: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "lightblue",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  addBtnText: {
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#F9FAFB",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 16,
    color: "#111827",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  emptyContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#9CA3AF",
    fontSize: 14,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    marginBottom: 12,
    marginTop: 8,
  },
  addBtnText: {
    fontWeight: "600",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
 */

import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/FirebaseConfig";
import { fetchAccessibleLists } from "@/utils/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
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

const Lists = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedLists, setSavedLists] = useState<any[]>([]);
  const [filteredLists, setFilteredLists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user, initializing } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (initializing) return;
      if (!user || !auth.currentUser) {
        router.replace("/login");
        return;
      }
      const fetchLists = async () => {
        try {
          setIsLoading(true);
          const lists = await fetchAccessibleLists(user!.uid);
          setSavedLists(lists);
        } catch (error) {
          console.log("Error fetching lists: " + error);
          Alert.alert("Could not retrieve lists from database");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLists();
      return () => {};
    }, [user, initializing, router])
  );

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredLists(
        savedLists.filter((list) =>
          list.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredLists(savedLists); // Show all lists when search is empty
    }
  }, [searchQuery, savedLists]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search for a list..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.heading}>Your Saved Lists</Text>
          <Link href={"/lists/add"} asChild>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.addBtnText}>Add New List</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.listContainer}>
          {isLoading && (
            <ActivityIndicator
              color="#007AFF"
              size="large"
              style={styles.activityIndicator}
            />
          )}
          {!isLoading && (
            <FlatList
              style={styles.flatList}
              data={searchQuery.length > 0 ? filteredLists : savedLists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Link
                  href={{
                    pathname: "/lists/[list]",
                    params: {
                      list: item.name,
                      listId: item.id,
                      ownerId: item.ownerId,
                    },
                  }}
                  asChild
                >
                  <TouchableOpacity style={styles.listItem}>
                    <Text style={styles.listTitle}>{item.name}</Text>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={20}
                      color="#C7C7CC"
                    />
                  </TouchableOpacity>
                </Link>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No lists found. Start by adding a new one!
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Lists;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  addBtnText: {
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 15,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E0E0E0",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    width: "100%",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "#FFFFFF",
  },
  listTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
});
