/* import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/FirebaseConfig";
import { Link, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const { user } = useAuth();
  if (!user || !auth.currentUser) {
    router.replace("/login");
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Profile</Text>
        <Text>{user?.uid}</Text>
        <Link href={"/"} onPress={() => auth.signOut()} asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Logout</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    fontSize: 15,
    padding: 2,
    fontWeight: "bold",
    textAlign: "center",
    color: "blue",
  },
});
 */

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { useRouter } from "expo-router"; // No need for Link if we're not navigating with it here
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"; // Import Image
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user || !auth.currentUser) {
    router.replace("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/login"); // Redirect to login after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally show an alert to the user
      // Alert.alert("Logout Failed", "Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.initialsAvatar}>
                <Text style={styles.initialsText}>
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.displayName}>
            {user.displayName || "User Name"}
          </Text>
          <Text style={styles.emailText}>{user.email}</Text>
          <Text style={styles.userIdText}>User ID: {user.uid}</Text>
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="person-outline" size={22} color="#4A4A4A" />
            <Text style={styles.settingText}>Edit Profile</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#C7C7CC"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="lock-closed-outline" size={22} color="#4A4A4A" />
            <Text style={styles.settingText}>Change Password</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#C7C7CC"
            />
          </TouchableOpacity>

          {/* Add more settings items as needed */}
          {/* <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={22} color="#4A4A4A" />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#C7C7CC" />
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7", // Consistent light background
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, // Padding from the sides
    paddingTop: 20, // Padding from the top
    alignItems: "center", // Center content horizontally
  },
  headerTitle: {
    fontSize: 28, // Prominent title for the page
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 30, // Space below the header
    alignSelf: "flex-start", // Align title to the left
  },
  profileCard: {
    backgroundColor: "#FFFFFF", // White background for the card
    borderRadius: 12, // Rounded corners
    padding: 20,
    alignItems: "center",
    width: "100%", // Take full width
    marginBottom: 30, // Space below the profile card
    shadowColor: "#000", // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 15,
    position: "relative", // For positioning the edit button
  },
  avatar: {
    width: 100, // Size of the avatar
    height: 100,
    borderRadius: 50, // Makes it circular
    backgroundColor: "#E0E0E0", // Placeholder background if no image
    borderWidth: StyleSheet.hairlineWidth, // Thin border
    borderColor: "#D1D1D6",
  },
  initialsAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF", // Accent color for initials background
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF", // Accent color
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF", // White border to stand out
  },
  displayName: {
    fontSize: 22, // Larger for the user's name
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#8E8E93", // Muted color for email
    marginBottom: 5,
  },
  userIdText: {
    fontSize: 14,
    color: "#C7C7CC", // Lighter color for less important info
  },
  settingsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "100%",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth, // Subtle separator
    borderBottomColor: "#E0E0E0",
  },
  settingText: {
    flex: 1, // Allows text to take up remaining space
    fontSize: 17,
    color: "#333",
    marginLeft: 15, // Space between icon and text
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 15,
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#FF3B30", // Red border for danger action
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  logoutButtonText: {
    color: "#FF3B30", // Red text for logout
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 10,
  },
});
