import { auth } from "@/firebase/FirebaseConfig";
import { validateEmail } from "@/utils/validateEmail";
import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../../components/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!validateEmail(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("Error during login: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.header}>Login</Text>
        <Input
          label="Email Address"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={handleEmailChange}
          iconName="mail"
          error={emailError}
          containerStyle={{ minWidth: 300 }}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={handlePasswordChange}
          iconName="lock-closed"
          error={passwordError}
          containerStyle={{ minWidth: 300 }}
        />
        <Link
          href={"/"}
          disabled={isLoading}
          onPress={handleLogin}
          style={styles.button}
          asChild
        >
          <TouchableOpacity>
            <Text style={styles.buttonText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Missing an account?</Text>
          <Link href={"/signup"} disabled={isLoading} asChild>
            <TouchableOpacity>
              <Text style={[styles.linkText, { color: "blue" }]}>
                Click here to sign up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "lightblue",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonText: {
    fontWeight: "bold",
  },
  textContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    padding: 2,
    textAlign: "center",
  },
  linkText: {
    fontSize: 15,
    padding: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
});
