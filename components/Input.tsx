import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  onIconPress?: () => void;
  containerStyle?: object;
  inputStyle?: object;
  secureTextEntry?: boolean;
}

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
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry); // Manage password visibility

  const handleFocus = () => setIsFocused(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        {iconName && (
          <TouchableOpacity onPress={onIconPress} activeOpacity={0.7}>
            <Ionicons
              name={iconName}
              size={20}
              color={isFocused ? "#444" : "#666"}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
        )}
        <TextInput
          style={[styles.textInput, inputStyle]}
          placeholderTextColor={placeholderTextColor}
          onFocus={handleFocus}
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
