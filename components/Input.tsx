import { InputProps } from "@/assets/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Input: React.FC<InputProps> = ({
  label,
  error,
  iconName,
  onIconPress,
  containerStyle,
  inputStyle,
  secureTextEntry,
  placeholderTextColor = "#888",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(!secureTextEntry); // Manage password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={"#666"}
            style={styles.leftIcon}
            tabIndex={0}
          />
        )}
        <TextInput
          style={[styles.textInput, inputStyle]}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry && !showPassword} // Apply secureTextEntry conditionally
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    width: "100%",
    position: "relative",
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
    borderColor: "#999",
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    height: 50,
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
    position: "absolute",
    bottom: -18,
    left: 5,
  },
});
