import { auth, db } from "@/firebase/FirebaseConfig";
import { validateEmail } from "@/utils/validateEmail";
import { Link } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email?.toLowerCase(),
        createdAt: new Date(),
      });
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
          onPress={handleSignup}
          style={styles.button}
          asChild
        >
          <TouchableOpacity>
            <Text style={styles.buttonText}>
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
        </Link>
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
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 20,
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
});
