import React from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import searchIcon from "../../assets/icons/searchIcon.png";

const SearchBar = ({ onPress, placeholder }: SearchBarProps) => {
  return (
    <View style={styles.searchBar}>
      <Image source={searchIcon} style={styles.searchIcon} />
      <TextInput
        placeholder={placeholder}
        value=""
        onChangeText={() => {}}
        onPress={onPress}
        style={styles.searchField}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    width: "80%",
  },
  searchIcon: {
    height: 25,
    width: 25,
    marginRight: 5,
  },
  searchField: {
    width: "100%",
  },
});
