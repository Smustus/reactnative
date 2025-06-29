import { InputProps } from "@/assets/interfaces/interfaces";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

const AddProductInput: React.FC<InputProps> = ({
  label,
  error,
  onIconPress,
  containerStyle,
  inputStyle,
  placeholderTextColor = "#888",
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          style={[styles.textInput, inputStyle]}
          placeholderTextColor={placeholderTextColor}
          onFocus={handleFocus}
          {...rest}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default AddProductInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: "100%",
    minWidth: 300,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    height: 50,
  },
  inputWrapperFocused: {
    borderColor: "#444",
    shadowColor: "#444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: "#dc3545", // Red for error
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: Platform.OS === "ios" ? 10 : 0, // Adjust padding for iOS/Android
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#dc3545", // Red for error text
    marginTop: 5,
  },
});
