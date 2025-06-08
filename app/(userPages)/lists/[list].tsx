import SearchBar from "@/app/components/SearchBar";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const PurchaseList = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text>PurchaseList</Text>
      <SearchBar
        /*  onPress={() => router.push("/search")} */
        placeholder="Search for a list"
        value={searchQuery}
        onChangeText={(text: string) => setSearchQuery(text)}
      />
      <FlatList
        data={[]}
        renderItem={() => (
          <View>
            <Text>{}</Text>
          </View>
        )}
        /* keyExtractor={(item) => item.id.toString()} */
        ListHeaderComponent={
          <>
            <Text>Inköpslistor</Text>
          </>
        }
        ListEmptyComponent={
          <View>
            <Text>No lists yet</Text>
          </View>
        }
      ></FlatList>
    </View>
  );
};

export default PurchaseList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
