import { auth } from "@/firebase/FirebaseConfig";
import { validateEmail } from "@/utils/validateEmail";
import { Link } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../../components/Input";

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
      await createUserWithEmailAndPassword(auth, email, password);
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
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.header}>Sign up</Text>
        <Input
          label="Email Address"
          placeholder="Enter your email"
          keyboardType="visible-password"
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
        <View style={styles.textContainer}>
          <Text style={styles.text}>Already have an account?</Text>
          <Link href={"/login"} disabled={isLoading} asChild>
            <TouchableOpacity>
              <Text style={[styles.linkText, { color: "blue" }]}>
                Click here to sign in
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
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
