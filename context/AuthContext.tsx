import { auth } from "@/firebase/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
        }
      } catch (error) {
        console.error("Failed to load user from storage: ", error);
      } finally {
        setInitializing(false);
      }
    };

    restoreUser();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        setUser(firebaseUser);
        await AsyncStorage.setItem("@user", JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        await AsyncStorage.removeItem("@user");
      }
    });

    return unsubscribe;
  }, []);
  const value = { user, initializing };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
