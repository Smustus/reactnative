import SearchBar from "@/components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const savedLists = [
  { id: "firstlist", title: "My First List" },
  { id: "groceries", title: "Groceries" },
  { id: "work", title: "Work To-Dos" },
];

const Lists = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLists = savedLists.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar
          placeholder="Search for a list"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.heading}>Saved Lists</Text>
        <Link href={"/lists/add"} style={styles.button} asChild>
          <TouchableOpacity>
            <Text style={styles.buttonText}>Add list</Text>
            <Ionicons name="add-circle-outline" size={24} />
          </TouchableOpacity>
        </Link>
        <FlatList
          data={filteredLists}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: "/lists/[list]", params: { list: item.title } }}
              asChild
            >
              <TouchableOpacity style={styles.listItem}>
                <Text style={styles.listTitle}>{item.title}</Text>
              </TouchableOpacity>
            </Link>
          )}
          /* keyExtractor={(item) => item.id.toString()} */
          ListHeaderComponent={
            <>
              <Text>Inköpslistor</Text>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No lists found</Text>
            </View>
          }
        ></FlatList>
      </View>
    </SafeAreaView>
  );
};

export default Lists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listTitle: {
    fontSize: 16,
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
    borderRadius: 15,
    backgroundColor: "lightblue",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
