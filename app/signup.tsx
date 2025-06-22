import { validateEmail } from "@/utils/validateEmail";
import { getAuth } from "@react-native-firebase/auth";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";

const Signup = () => {
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

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      await getAuth().createUserWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.log("Error during signup: " + error);
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
      }

      if (error.code === "auth/invalid-email") {
        console.log("That email address is invalid!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Signup</Text>
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
      <Button
        title={isLoading ? "Signing Up..." : "Sign Up"}
        onPress={handleSignup}
      />
      <Link href={"/login"} asChild>
        <TouchableOpacity>
          <Text>Already have an account? Click here to sign in!</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
};

export default Signup;

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
