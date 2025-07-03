import { db } from "@/firebase/FirebaseConfig";
import {
  arrayUnion,
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const getUserByEmail = async (email: string) => {
  const normalizedEmail = email.toLowerCase();

  const q = query(
    collection(db, "users"),
    where("email", "==", normalizedEmail)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) throw new Error("User not found");
  return querySnapshot.docs[0].id;
};

export const shareListWithUser = async (
  userId: string,
  listId: string,
  targetUid: string
) => {
  const listRef = doc(db, `users/${userId}/lists/${listId}`);
  await updateDoc(listRef, {
    sharedWith: arrayUnion(targetUid),
  });
};

export const fetchAccessibleLists = async (userId: string) => {
  const ownedListsQuery = query(collection(db, `users/${userId}/lists`));
  const sharedListsQuery = query(
    collectionGroup(db, "lists"),
    where("sharedWith", "array-contains", userId)
  );

  const [ownedSnap, sharedSnap] = await Promise.all([
    getDocs(ownedListsQuery),
    getDocs(sharedListsQuery),
  ]);

  const ownedLists = ownedSnap.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  const sharedLists = sharedSnap.docs
    .filter((doc) => doc.data().ownerId !== userId)
    .map((doc) => ({ ...doc.data(), id: doc.id }));

  return [...ownedLists, ...sharedLists];
};
