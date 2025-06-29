import { SearchBarProps } from "@/assets/interfaces/interfaces";
import React, { useState } from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import searchIcon from "../assets/icons/searchIcon.png";

const SearchBar = ({
  onPress,
  placeholder,
  value,
  onChangeText,
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);

  return (
    <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
      <Image source={searchIcon} style={styles.searchIcon} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onPress={onPress}
        onFocus={handleFocus}
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
    backgroundColor: "rgba(225, 225, 225, 0.9)",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 5,
    margin: 5,
    width: "80%",
    borderWidth: 1,
    borderColor: "#777",
  },
  searchBarFocused: {
    borderColor: "#111",
    backgroundColor: "#fff",
    shadowColor: "#444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
