import SearchBar from "@/app/components/SearchBar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PurchaseList = () => {
  return (
    <View style={styles.container}>
      <Text>PurchaseList</Text>
      <SearchBar
        /*  onPress={() => router.push("/search")} */
        placeholder="Search for a list"
      />
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
