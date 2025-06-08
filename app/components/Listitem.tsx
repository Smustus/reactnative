import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const ListItem = (listid: any) => {
  return (
    <Link href={`/lists/${listid}`} asChild>
      <TouchableOpacity style={styles.container}>
        <Text>ListItem</Text>
        <Text>{listid}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
