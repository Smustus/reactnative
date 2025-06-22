import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true); // Tracks initial auth state loading

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged((firebaseUser: any) => {
      setUser(firebaseUser);
      if (loading) {
        setLoading(false);
      }
    });

    // Unsubscribe from listener when the component unmounts
    return subscriber;
  }, [loading]); // Only re-run if loading state changes

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
