import { TextInputProps } from "react-native";

interface SearchBarProps {
  onPress?: () => void;
  placeholder: string;
  value: string;
  onChangeText: (text) => void;
}

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  onIconPress?: () => void;
  containerStyle?: object;
  inputStyle?: object;
  secureTextEntry?: boolean;
  placeholderTextColor?: string;
}
