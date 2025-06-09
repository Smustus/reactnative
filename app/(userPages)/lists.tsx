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
import SearchBar from "../components/SearchBar";

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
          /*  onPress={() => router.push("/search")} */
          placeholder="Search for a list"
          value={searchQuery}
          /*  onChangeText={(text: string) => setSearchQuery(text)} */
          onChangeText={setSearchQuery}
        />
        <Text style={styles.heading}>Saved Lists</Text>

        <FlatList
          data={filteredLists}
          renderItem={({ item }) => (
            <Link href={`/lists/${item.id}`} asChild>
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
});
