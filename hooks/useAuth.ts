import { auth } from "@/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
export default useAuth;
