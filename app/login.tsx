import { auth } from "@/firebase/FirebaseConfig";
import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "./components/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

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
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("Error during login: " + error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
      />
      <Input
        label="Password"
        placeholder="Enter your password"
        secureTextEntry={true}
        value={password}
        onChangeText={handlePasswordChange}
        iconName="lock-closed"
        error={passwordError}
      />
      <Button title="Login" onPress={handleLogin} />
      <Link href={"/signup"} asChild>
        <TouchableOpacity>
          <Text>Missing an account? Click here to signup!</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
  },
});
